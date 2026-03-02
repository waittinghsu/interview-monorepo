<script setup lang="ts">
import type { ActorInstance } from '../type'
import { shallowRef } from 'vue'
import { useCanvasContext } from '../../../composables/useCanvasContext'
import { useActor } from '../use-actor'

interface Props {
  scale?: number
  duration?: number
}
const props = withDefaults(defineProps<Props>(), {
  scale: 2,
  duration: 1000,
})

const {
  canvasRef,
  canvasContext,
  clearContext,
} = useCanvasContext('2d')

type Points = [[number, number], [number, number], [number, number]]
interface Shard {
  // 從快照圖上要裁切的來源區塊（仍用矩形來源）
  sx: number
  sy: number
  sw: number
  sh: number

  // 畫到畫布上的目標原始位置（tile 的左上角，未飄散時）
  dx: number
  dy: number

  // 三角形三個頂點（相對於該 tile 的局部座標，0,0 在 tile 左上）
  points: Points
  // 三角形質心（局部座標，用來當旋轉中心）
  cx: number
  cy: number

  // 飄散位移與旋轉
  vx: number
  vy: number
  vr: number

  // 微小延遲
  delay: number
}

const shards = shallowRef<Shard[]>([])

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
    const dpr = pixelRatio.value
    const ctx = canvasContext.value
    const canvas = canvasRef.value
    const img = image.value
    const rect = elRect.value
    const parts = shards.value

    if (!ctx || !canvas || !img || !rect || parts.length === 0)
      return

    const imgScaleX = rect ? img.width / rect.width : 1
    const imgScaleY = rect ? img.height / rect.height : 1

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    clearContext()

    // 用 dpr 縮放繪製座標系
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    for (const p of parts) {
      const baseT = progressRate.value
      const t = Math.min(1, Math.max(0, (baseT - p.delay) / (1 - p.delay + 1e-6)))
      const e = easeOutCubic(t)

      const px = p.dx + p.vx * e
      const py = p.dy + p.vy * e
      const gy = (rect.height * 0.2) * e * e
      const angle = p.vr * e
      const alpha = 1 - e

      ctx.save()
      ctx.globalAlpha = alpha

      // 以三角形質心為旋轉中心
      ctx.translate(px + p.cx, py + p.cy + gy)
      ctx.rotate(angle)
      ctx.translate(-p.cx, -p.cy)

      // 建立三角形裁切路徑（座標為 tile 局部 0..sw/sh）
      ctx.beginPath()
      ctx.moveTo(p.points[0][0], p.points[0][1])
      ctx.lineTo(p.points[1][0], p.points[1][1])
      ctx.lineTo(p.points[2][0], p.points[2][1])
      ctx.closePath()
      ctx.clip()

      // 將來源矩形畫到同一局部座標系，再由 clip 保留三角形
      ctx.drawImage(
        img,
        p.sx * imgScaleX,
        p.sy * imgScaleY,
        p.sw * imgScaleX,
        p.sh * imgScaleY,
        0,
        0,
        p.sw,
        p.sh,
      )

      ctx.restore()
    }
  },
})

/** 產生破碎碎片 */
function buildShards() {
  const rect = elRect.value
  const img = image.value
  const canvas = canvasRef.value
  const dpr = pixelRatio.value

  if (!rect || !img || !canvas)
    return

  const cw = canvas.width / dpr
  const ch = canvas.height / dpr

  const cxCanvas = cw / 2
  const cyCanvas = ch / 2

  const dw = rect.width
  const dh = rect.height
  const dx0 = (cw - dw) / 2
  const dy0 = (ch - dh) / 2

  const tile = 15
  const cols = Math.ceil(rect.width / tile)
  const rows = Math.ceil(rect.height / tile)

  const list: Shard[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const sw = (x === cols - 1) ? (rect.width - x * tile) : tile
      const sh = (y === rows - 1) ? (rect.height - y * tile) : tile
      const sx = x * tile
      const sy = y * tile

      const ddx = dx0 + sx
      const ddy = dy0 + sy

      // 交錯對角線，讓圖形更自然
      const diagA = ((x + y) % 2) === 0

      // 兩個三角形的點
      const tri1: Points = diagA
        ? [[0, 0], [sw, 0], [0, sh]]
        : [[0, 0], [sw, 0], [sw, sh]]

      const tri2: Points = diagA
        ? [[sw, 0], [sw, sh], [0, sh]]
        : [[0, 0], [sw, sh], [0, sh]]

      const makeShard = (points: Points) => {
        // 三角形質心（平均三頂點）
        const cxLocal = (points[0][0] + points[1][0] + points[2][0]) / 3
        const cyLocal = (points[0][1] + points[1][1] + points[2][1]) / 3

        // 三角形中心在畫布座標
        const mx = ddx + cxLocal
        const my = ddy + cyLocal

        // 由畫布中心噴散的方向向量
        const vx0 = mx - cxCanvas
        const vy0 = my - cyCanvas
        const len = Math.hypot(vx0, vy0) || 1
        const dirX = vx0 / len
        const dirY = vy0 / len

        // 飄散距離與旋轉隨機
        const spread = 200 * (0.25 + Math.random() * 0.35)
        const jitter = (tile * 0.6) * (Math.random() - 0.5)
        const vx = dirX * spread + jitter
        const vy = dirY * (spread * (0.8 + Math.random() * 0.6)) + jitter
        const vr = (Math.random() - 0.5) * (Math.PI * 0.8)
        const delay = Math.random() * 0.15

        const shard: Shard = {
          sx,
          sy,
          sw,
          sh,
          dx: ddx,
          dy: ddy,
          points,
          cx: cxLocal,
          cy: cyLocal,
          vx,
          vy,
          vr,
          delay,
        }
        return shard
      }

      list.push(makeShard(tri1))
      list.push(makeShard(tri2))
    }
  }

  shards.value = list
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

async function init(el: HTMLElement) {
  clearContext()

  await updateImage(el)

  buildShards()
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
