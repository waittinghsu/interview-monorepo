import type { Ref, ShallowRef } from 'vue'
import { ref, shallowRef, watch } from 'vue'

type ContextId = '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer'

export function useCanvasContext(
  contextId: 'bitmaprenderer'
): {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  canvasContext: ShallowRef<ImageBitmapRenderingContext | null>
  clearContext: () => void
}
export function useCanvasContext(
  contextId: 'webgl2'
): {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  canvasContext: ShallowRef<WebGL2RenderingContext | null>
  clearContext: () => void
}
export function useCanvasContext(
  contextId: 'webgl'
): {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  canvasContext: ShallowRef<WebGLRenderingContext | null>
  clearContext: () => void
}
export function useCanvasContext(
  contextId: '2d'
): {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  canvasContext: ShallowRef<CanvasRenderingContext2D | null>
  clearContext: () => void
}
export function useCanvasContext(
  contextId: ContextId,
) {
  const canvasRef = ref<HTMLCanvasElement>()
  const canvasContext = shallowRef<RenderingContext | null>()
  watch(canvasRef, (el) => {
    if (!el) {
      return
    }

    canvasContext.value = el.getContext(contextId)
    console.log(`🚀 ~ canvasContext:`, canvasContext)
  })

  return {
    canvasRef,
    canvasContext,

    clearContext() {
      const {
        width = 0,
        height = 0,
      } = canvasRef.value ?? {}

      const ctx = canvasContext.value

      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, width, height)
      }
    },
  }
}
