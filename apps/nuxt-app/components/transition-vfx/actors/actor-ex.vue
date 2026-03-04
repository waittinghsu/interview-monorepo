<script setup lang="ts">
import type { ActorInstance } from '../type'
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

    if (!ctx || !canvas || !img || !rect) {
      return
    }

    const rate = progressRate.value

    const cw = canvas.width
    const ch = canvas.height

    const dw = img.width
    const dh = img.height
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    clearContext()

    ctx.globalAlpha = 1 - rate
    ctx.drawImage(img, dx, dy, rect.width, rect.height)

    // 示意用的正方形
    const side = Math.min(rect.width, rect.height) * 0.3
    const sx = dx + (rect.width - side) / 2
    const sy = dy + (rect.height - side) / 2
    ctx.lineWidth = 2
    ctx.strokeStyle = '#00A3FF'
    ctx.strokeRect(sx, sy, side, side)
  },
})

async function init(el: HTMLElement) {
  clearContext()

  await updateImage(el)
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
