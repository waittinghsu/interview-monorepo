<script setup lang="ts">
import type { ActorInstance } from '../type'
import { onMounted, ref, shallowRef } from 'vue'
import { useActor } from '../use-actor'

interface Props {
  scale?: number
  duration?: number
  /** Perlin 噪聲頻率，越大圖樣越細 */
  freq?: number
  /** 噪聲幅度，控制最大位移強度 */
  amp?: number
}
const props = withDefaults(defineProps<Props>(), {
  scale: 2,
  duration: 800,
  freq: 10,
  amp: 40,
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
    uProgress?: WebGLUniformLocation | null // 0..1：位移強度 + 透明度
    uFreq?: WebGLUniformLocation | null
    uAmp?: WebGLUniformLocation | null
    uTime?: WebGLUniformLocation | null // 秒數（持續遞增）
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

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uProgress;   // 0..1：0 無效果、1 最強烈
uniform float uFreq;       // 噪聲頻率（越大越細緻）
uniform float uAmp;        // 最大位移強度
uniform float uTime;       // 時間（秒），由 JS 每幀遞增傳入

// ---- Ashima 3D Classic Perlin noise ----
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
  return 2.2 * n_xyz; // 大致落在 [-1,1]
}


float fbm(vec3 p){
  float a = 0.5;
  float s = 0.0;
  for (int i=0; i<5; i++){
    s += a * cnoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return s; // 約 [-1,1]
}

// 取得 2D turbulence 位移（兩組 decorrelated fbm），加入時間演化
vec2 turb(vec2 uv, float f, float t){
  // 以 t 當作 3D 噪聲的 Z 軸，讓圖樣隨時間流動
  float nx = fbm(vec3(uv * f, t));
  float ny = fbm(vec3((uv.yx + vec2(7.13, -3.71)) * f, t + 10.0));
  return vec2(nx, ny);
}

void main(){
  float p = clamp(uProgress, 0.0, 1.0);

  // 調整「演化速度」，0.2 可依需求調快/慢
  float evolution = uTime * 0.1;

  // 位移強度：隨 progress 提升，同時做 freq 正規化
  float strength = 0.12 * uAmp / (uFreq + 1.0) * p;

  // turbulence 位移（隨時間演化）
  vec2 d = turb(vUv, uFreq, evolution);
  vec2 uv = vUv + d * strength;

  vec4 tex = texture2D(uTex, uv);

  // 淡出：預乘 Alpha（避免黑邊/白邊）
  float fade = 1.0 - p;
  // 想要更柔一點可用平方：fade *= fade;
  vec3 rgb = tex.rgb * fade;
  float a   = tex.a   * fade;

  gl_FragColor = vec4(rgb, a);
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
    uFreq: gl.getUniformLocation(program, 'uFreq'),
    uAmp: gl.getUniformLocation(program, 'uAmp'),
    uTime: gl.getUniformLocation(program, 'uTime'),
  }

  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  // 預乘 alpha 混合
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  glState.value = { gl, program, texture: tex, posBuf, uvBuf, loc }
}

let t0 = 0
onMounted(() => {
  if (canvasRef.value)
    setupGL(canvasRef.value)
  // 記錄時間基準
  t0 = performance.now()
})

function uploadTextureFromCanvas(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  src: HTMLCanvasElement,
) {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
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
    gl.uniform1f(state.loc.uProgress!, progressRate.value) // 0..1
    gl.uniform1f(state.loc.uFreq!, props.freq)
    gl.uniform1f(state.loc.uAmp!, props.amp)

    // 時間（秒）
    const now = performance.now()
    const tSec = (now - t0) * 0.001
    gl.uniform1f(state.loc.uTime!, tSec)

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
  enter: () => play(0), // progress: 0 -> 目標
  leave: () => play(1), // progress: 1 -> 最強/全透明
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
