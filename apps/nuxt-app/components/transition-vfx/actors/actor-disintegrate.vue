<script setup lang="ts">
import type { ActorInstance } from '../type'
import { onUnmounted, useTemplateRef } from 'vue'
import { useActor } from '../use-actor'

interface Props {
  scale?: number
  duration?: number
}
const props = withDefaults(defineProps<Props>(), {
  scale: 2,
  duration: 2000,
})

const canvasRef = useTemplateRef('canvasRef')

const {
  progressRate,
  image,
  elRect,
  pixelRatio,
  canvasAttrs,
  updateImage,
  play,
} = useActor({
  scale: () => props.scale,
  duration: () => props.duration,
  draw() {
    render()
  },
})

let gl: WebGL2RenderingContext | null = null
let program: WebGLProgram | null = null
let vao: WebGLVertexArrayObject | null = null
let vbo: WebGLBuffer | null = null
let tex: WebGLTexture | null = null

let u_image = -1
let u_resolution: WebGLUniformLocation | null = null
let u_imgRect: WebGLUniformLocation | null = null
let u_imgSize: WebGLUniformLocation | null = null
let u_progress: WebGLUniformLocation | null = null
let u_time: WebGLUniformLocation | null = null
let u_windAngle: WebGLUniformLocation | null = null
let u_swirlRatio: WebGLUniformLocation | null = null
let u_maxDrift: WebGLUniformLocation | null = null
let u_jitterPx: WebGLUniformLocation | null = null
let u_maxRowDelay: WebGLUniformLocation | null = null
let u_maxColDelay: WebGLUniformLocation | null = null

let isInit = false
let canvasW = 2
let canvasH = 2
let imgW = 0
let imgH = 0

/** 風參數（可依需要改成 props 或外部控制） */
const windAngle = (-15 * Math.PI) / 180
const swirlRatio = 0.25
const jitterPxBase = 8
const maxRowDelay = 0.6
const maxColDelay = 0.3

/** 工具 */
function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v))
}

/** 建立/連結 Shader */
function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`Shader compile error:\n${log}`)
  }
  return sh
}
function createProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`Program link error:\n${log}`)
  }
  return prog
}

/** GLSL：全螢幕三角形 */
const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

/** GLSL：風飄散（以反向位移取樣原圖） */
const FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_image;
uniform vec2  u_resolution;   // 畫布像素大小
uniform vec4  u_imgRect;      // 影像在畫布上的 xywh（像素）；以畫布左下角為原點
uniform vec2  u_imgSize;      // 影像像素大小
uniform float u_progress;     // 0..1
uniform float u_time;         // 秒
uniform float u_windAngle;    // 弧度
uniform float u_swirlRatio;
uniform float u_maxDrift;     // 最大飄散距離（像素）
uniform float u_jitterPx;     // 微抖動（像素）
uniform float u_maxRowDelay;  // 列延遲占比
uniform float u_maxColDelay;  // 欄延遲占比

float clamp01(float x){ return clamp(x, 0.0, 1.0); }
float easeInOut(float t){ return (t < 0.5) ? (2.0*t*t) : (-1.0 + (4.0 - 2.0*t)*t); }

// 小 hash / value noise
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
}

void main(){
  // gl_FragCoord.xy：以畫布左下角為 (0,0) 的像素座標
  vec2 frag = gl_FragCoord.xy;

  // 對應到影像區域的 uv（未位移）
  vec2 uv0 = (frag - u_imgRect.xy) / u_imgRect.zw;

  // 列/欄延遲（0 在上方；因使用左下角原點，需將 y 反向）
  float yNorm = clamp01(1.0 - uv0.y);
  float xNorm = clamp01(uv0.x);
  float jitter = 0.06 * hash12(frag * 0.123);
  float delay = clamp01(yNorm * u_maxRowDelay + xNorm * u_maxColDelay + jitter);

  float td = clamp01((u_progress - delay) / (1.0 - delay + 1e-6));
  float ease = easeInOut(td);

  // 風向與法線
  vec2 wdir = vec2(cos(u_windAngle), sin(u_windAngle));
  vec2 pdir = vec2(cos(u_windAngle + 1.57079632679), sin(u_windAngle + 1.57079632679));

  // 以未位移的 uv0 先取亮度，作為飄散幅度的權重
  vec4 baseSample = texture(u_image, uv0);
  float lum = dot(baseSample.rgb, vec3(0.2126, 0.7152, 0.0722));

  float seed  = hash12(frag * 0.37 + vec2(lum, 0.0));
  float drift = u_maxDrift * (0.65 + 0.55 * lum) * (0.85 + 0.3 * seed);

  float mainMove = drift * ease;
  float swirlAmp = drift * u_swirlRatio * ease;
  float swirl = sin(u_time * 1.3 + seed * 6.2831853 + td * 4.0) * swirlAmp;
  float jx = (noise(vec2(seed*1000.0 + td*6.0, 0.0)) - 0.5) * u_jitterPx * ease;
  float jy = (noise(vec2(seed*2000.0 + td*6.0, 1.0)) - 0.5) * u_jitterPx * ease;

  // 反向位移回原像素所在位置再取樣
  vec2 disp = wdir * mainMove + pdir * swirl + vec2(jx, jy);
  vec2 originFrag = frag - disp;
  vec2 uv = (originFrag - u_imgRect.xy) / u_imgRect.zw;

  // 超出影像範圍 -> 透明
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))){
    outColor = vec4(0.0);
    return;
  }

  vec4 src = texture(u_image, uv);
  float m = clamp01(1.0 - ease);
  outColor = vec4(src.rgb * m, src.a * m);
}
`

async function init(el: HTMLElement) {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  if (gl) {
    // 清除畫布
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.disable(gl.SCISSOR_TEST)
    gl.colorMask(true, true, true, true)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
  }

  await updateImage(el)
  if (!elRect.value || !image.value || !canvasRef.value)
    return

  // 設定畫布大小（實體像素）
  const cssW = Math.max(2, Math.round(elRect.value.width * props.scale))
  const cssH = Math.max(2, Math.round(elRect.value.height * props.scale))
  const dpr = Math.max(1, pixelRatio.value)
  canvasW = cssW * dpr
  canvasH = cssH * dpr

  canvas.width = canvasW
  canvas.height = canvasH

  if (!gl) {
    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    })
    if (!gl)
      throw new Error('此環境不支援 WebGL2')
  }

  if (!isInit) {
    // 建立 GL 資源
    program = createProgram(gl, VS, FS)
    gl.useProgram(program)

    // 全螢幕兩個三角形
    vao = gl.createVertexArray()
    vbo = gl.createBuffer()
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const quad = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    // Uniform 位置
    u_image = gl.getUniformLocation(program, 'u_image') as unknown as number
    u_resolution = gl.getUniformLocation(program, 'u_resolution')
    u_imgRect = gl.getUniformLocation(program, 'u_imgRect')
    u_imgSize = gl.getUniformLocation(program, 'u_imgSize')
    u_progress = gl.getUniformLocation(program, 'u_progress')
    u_time = gl.getUniformLocation(program, 'u_time')
    u_windAngle = gl.getUniformLocation(program, 'u_windAngle')
    u_swirlRatio = gl.getUniformLocation(program, 'u_swirlRatio')
    u_maxDrift = gl.getUniformLocation(program, 'u_maxDrift')
    u_jitterPx = gl.getUniformLocation(program, 'u_jitterPx')
    u_maxRowDelay = gl.getUniformLocation(program, 'u_maxRowDelay')
    u_maxColDelay = gl.getUniformLocation(program, 'u_maxColDelay')

    // 共用狀態
    gl.viewport(0, 0, canvasW, canvasH)
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    isInit = true
  }
  else {
    gl.viewport(0, 0, canvasW, canvasH)
  }

  // 影像 texture
  if (tex) {
    gl.deleteTexture(tex)
  }
  tex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.value)

  // 影像資訊與置中矩形（以畫布像素為單位，左下角原點）
  imgW = image.value.width
  imgH = image.value.height
  const imgX = (canvasW - imgW) * 0.5
  const imgY = (canvasH - imgH) * 0.5

  // 靜態 uniform
  gl.useProgram(program!)
  gl.uniform1i(u_image as any, 0)
  gl.uniform2f(u_resolution, canvasW, canvasH)
  gl.uniform4f(u_imgRect, imgX, imgY, imgW, imgH)
  gl.uniform2f(u_imgSize, imgW, imgH)
  gl.uniform1f(u_windAngle, windAngle)
  gl.uniform1f(u_swirlRatio, swirlRatio)
  gl.uniform1f(u_jitterPx, jitterPxBase * dpr)
  gl.uniform1f(u_maxRowDelay, maxRowDelay)
  gl.uniform1f(u_maxColDelay, maxColDelay)
}

/** 每幀繪製 */
function render() {
  if (!gl || !program || !vao || !tex)
    return
  gl.useProgram(program)
  gl.bindVertexArray(vao)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, tex)

  // 依畫布對角線估算最大飄散距離（像素座標）
  const maxDrift = Math.hypot(canvasW, canvasH) * 0.6

  gl.uniform1f(u_time, performance.now() * 0.001)
  gl.uniform1f(u_progress, clamp(progressRate.value, 0, 1))
  gl.uniform1f(u_maxDrift, maxDrift)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

onUnmounted(() => {
  try {
    if (gl) {
      if (tex)
        gl.deleteTexture(tex)
      if (vbo)
        gl.deleteBuffer(vbo)
      if (vao)
        gl.deleteVertexArray(vao)
      if (program)
        gl.deleteProgram(program)
    }
  }
  catch {
    // noop
  }
  finally {
    gl = null
    program = null
    vao = null
    vbo = null
    tex = null
    isInit = false
  }
})

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
