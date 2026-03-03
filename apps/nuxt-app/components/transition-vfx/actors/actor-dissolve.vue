<script setup lang="ts">
import type { ActorInstance } from '../type'
import { onMounted, ref, shallowRef } from 'vue'
import { useActor } from '../use-actor'

interface Props {
  scale?: number
  duration?: number
  /** Perlin 噪聲頻率，越大圖樣越細 */
  freq?: number
  /** 噪聲幅度，決定輸出落在 [-amp, +amp] 的範圍 */
  amp?: number
  /** 邊緣寬度（與噪聲同單位） */
  edge?: number
  /** 邊緣顏色 */
  edgeColor?: [number, number, number]
}
const props = withDefaults(defineProps<Props>(), {
  scale: 2,
  duration: 1000,
  freq: 3.0,
  amp: 1.0,
  edge: 0.15,
  edgeColor: () => [0, 163, 255],
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

/** WebGL 狀態 */
interface GLState {
  gl: WebGLRenderingContext | null
  program: WebGLProgram | null
  texture: WebGLTexture | null
  posBuf: WebGLBuffer | null
  uvBuf: WebGLBuffer | null
  loc: {
    aPosition?: number
    aUv?: number
    uTex?: WebGLUniformLocation | null
    uProgress?: WebGLUniformLocation | null
    uEdge?: WebGLUniformLocation | null
    uFreq?: WebGLUniformLocation | null
    uAmp?: WebGLUniformLocation | null
    uEdgeColor?: WebGLUniformLocation | null
  }
}
const glState = shallowRef<GLState>({
  gl: null,
  program: null,
  texture: null,
  posBuf: null,
  uvBuf: null,
  loc: {},
})

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, source)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`Shader compile error: ${info}`)
  }
  return sh
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`Program link error: ${info}`)
  }
  return prog
}

const VERT = `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

// Ashima 3D Classic Perlin noise (cnoise)
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uProgress;
uniform float uEdge;
uniform float uFreq;
uniform float uAmp;
uniform vec3  uEdgeColor;

// Ashima code (public domain / MIT-like)
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
  vec4 iz0 = vec4(Pi0.z);
  vec4 iz1 = vec4(Pi1.z);

  vec4 i0 = permute(permute(ix) + iy);
  vec4 i1 = permute(permute(ix) + iy + vec4(1.0));

  vec4 gx0 = i0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = i1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.x, Pf1.y, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.x, Pf0.y, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.y, Pf1.z));
  float n111 = dot(g111, vec3(Pf1.x, Pf1.y, Pf1.z));

  vec3 fade_xyz = Pf0*Pf0*Pf0*(Pf0*(Pf0*6.0-15.0)+10.0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz; // roughly [-1,1]
}

void main() {
  vec4 base = texture2D(uTex, vUv);
  // 噪聲值：[-uAmp, +uAmp]
  float noise = cnoise(vec3(vUv * uFreq, 0.0)) * uAmp;

  // 溶解（丟棄）
  if (noise < uProgress) discard;

  float edgeHi = uProgress + uEdge;
  // 邊緣著色
  if (noise > uProgress && noise < edgeHi) {
    gl_FragColor = vec4(uEdgeColor, 1.0);
    return;
  }

  // 保留原圖像素
  gl_FragColor = base;
}
`

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  }) as WebGLRenderingContext | null
  if (!gl)
    throw new Error('WebGL not supported')

  const program = createProgram(gl, VERT, FRAG)
  gl.useProgram(program)

  const posBuf = gl.createBuffer()!
  const uvBuf = gl.createBuffer()!

  // 紋理
  const tex = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const loc = {
    aPosition: gl.getAttribLocation(program, 'aPosition'),
    aUv: gl.getAttribLocation(program, 'aUv'),
    uTex: gl.getUniformLocation(program, 'uTex'),
    uProgress: gl.getUniformLocation(program, 'uProgress'),
    uEdge: gl.getUniformLocation(program, 'uEdge'),
    uFreq: gl.getUniformLocation(program, 'uFreq'),
    uAmp: gl.getUniformLocation(program, 'uAmp'),
    uEdgeColor: gl.getUniformLocation(program, 'uEdgeColor'),
  }

  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  glState.value = { gl, program, texture: tex, posBuf, uvBuf, loc }
}
onMounted(() => {
  if (canvasRef.value)
    setupGL(canvasRef.value)
})

function uploadTextureFromCanvas(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  src: HTMLCanvasElement,
) {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
}

function updateQuadForImage(
  gl: WebGLRenderingContext,
  posBuf: WebGLBuffer,
  uvBuf: WebGLBuffer,
  cw: number,
  ch: number,
  iw: number,
  ih: number,
) {
  const hx = (iw / cw)
  const hy = (ih / ch)

  const left = -hx
  const right = hx
  const top = hy
  const bottom = -hy

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      left,
      bottom,
      right,
      bottom,
      left,
      top,
      right,
      top,
    ]),
    gl.DYNAMIC_DRAW,
  )

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
    ]),
    gl.STATIC_DRAW,
  )
}

const {
  progressRate,
  image,
  elRect: _elRect,
  pixelRatio: _pixelRatio,
  canvasAttrs,
  updateImage,
  play,
} = useActor({
  scale: () => props.scale,
  duration: () => props.duration,
  draw() {
    const state = glState.value
    const gl = state.gl
    const canvas = canvasRef.value
    const img = image.value
    if (!gl || !canvas || !img || !state.program)
      return

    const cw = canvas.width
    const ch = canvas.height

    gl.viewport(0, 0, cw, ch)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 依「原始圖片尺寸」更新頂點（置中）
    updateQuadForImage(gl, state.posBuf!, state.uvBuf!, cw, ch, img.width, img.height)

    gl.useProgram(state.program)

    // 綁定 attribute: position
    gl.bindBuffer(gl.ARRAY_BUFFER, state.posBuf)
    gl.enableVertexAttribArray(state.loc.aPosition!)
    gl.vertexAttribPointer(state.loc.aPosition!, 2, gl.FLOAT, false, 0, 0)

    // 綁定 attribute: uv
    gl.bindBuffer(gl.ARRAY_BUFFER, state.uvBuf)
    gl.enableVertexAttribArray(state.loc.aUv!)
    gl.vertexAttribPointer(state.loc.aUv!, 2, gl.FLOAT, false, 0, 0)

    // 紋理
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, state.texture)
    gl.uniform1i(state.loc.uTex!, 0)

    // uniforms
    const amp = props.amp
    const progress = -amp + progressRate.value * (2 * amp) // [0,1] -> [-amp,+amp]
    gl.uniform1f(state.loc.uProgress!, progress)
    gl.uniform1f(state.loc.uEdge!, props.edge)
    gl.uniform1f(state.loc.uFreq!, props.freq)
    gl.uniform1f(state.loc.uAmp!, amp)

    const [r, g, b] = props.edgeColor
    gl.uniform3f(state.loc.uEdgeColor!, r, g, b)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  },
})

async function init(el: HTMLElement) {
  const { texture, gl } = glState.value
  const canvas = canvasRef.value!

  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.disable(gl.SCISSOR_TEST)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.flush()
  }

  await updateImage(el)

  if (gl && texture && image.value) {
    uploadTextureFromCanvas(gl, texture, image.value)
  }
}

defineExpose<ActorInstance>({
  init,
  enter: () => play(0),
  leave: () => play(1),
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none"
    v-bind="canvasAttrs"
  />
</template>

<style scoped lang="sass">
</style>
