import type { MaybeRefOrGetter } from 'vue'
import { useDevicePixelRatio, useRafFn } from '@vueuse/core'
import { snapdom } from '@zumer/snapdom'
import { animate } from 'animejs-v4'
import { computed, nextTick, ref, shallowRef, toValue } from 'vue'

interface UseActorParams {
  scale: MaybeRefOrGetter<number>
  duration: MaybeRefOrGetter<number>
  draw?: () => void | Promise<void>
}

export function useActor(data: UseActorParams) {
  const progressRate = ref(0)
  const image = shallowRef<HTMLCanvasElement>()
  const elRect = shallowRef<DOMRect>()
  async function updateImage(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    elRect.value = rect

    // 複製一份，調整樣式，避免 el 不可見
    const box = document.createElement('div')
    Object.assign(box.style, {
      position: 'fixed',
      inset: '0',
      width: '0',
      height: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '-1',
      contain: 'strict',
    })
    el.parentElement?.appendChild(box)

    const cloneEl = el.cloneNode(true) as HTMLElement
    Object.assign(cloneEl.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      opacity: '1',
      transform: 'none',
      transition: 'none',
      animation: 'none',
    })
    box.appendChild(cloneEl)

    const imgCanvas = await snapdom.toCanvas(cloneEl)
    box.remove()

    // 確保外部依賴資料更新
    await nextTick()

    image.value = imgCanvas
  }

  const { pixelRatio } = useDevicePixelRatio()

  const { pause, resume } = useRafFn(() => {
    data.draw?.()
  }, { immediate: false })

  async function play(targetRate: number) {
    progressRate.value = targetRate ? 0 : 1

    resume()
    await animate(progressRate, {
      value: targetRate,
      duration: toValue(data.duration),
    }).then()
    pause()
  }

  return {
    /** 動畫進度 (0~1) */
    progressRate,
    image,
    updateImage,
    elRect,
    pixelRatio,
    /** 綁定於 canvas 上 */
    canvasAttrs: computed(() => {
      const scale = toValue(data.scale)
      const dpr = pixelRatio.value
      const rect = elRect.value
      if (!rect) {
        return { width: 0, height: 0 }
      }

      return {
        width: Math.round(rect.width * dpr * scale),
        height: Math.round(rect.height * dpr * scale),
      }
    }),

    play,
  }
}
