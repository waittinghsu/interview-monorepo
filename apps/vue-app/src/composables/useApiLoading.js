import { loadingBus } from '@/api/loading'

/**
 * useApiLoading
 *
 * 訂閱全域 HTTP loading 狀態（由攔截器驅動）。
 * 適合用於全域 loading bar、按鈕 disabled 等場景。
 *
 * 與 useLoading（本地 loading）的差異：
 *   useLoading     → 手動控制單一操作的 loading 狀態
 *   useApiLoading  → 自動追蹤所有進行中的 HTTP 請求
 *
 * 使用範例：
 *   const { isLoading, pendingCount } = useApiLoading()
 *
 * 排除特定請求不計入 loading：
 *   userApi.getProfile({ skipLoading: true })
 *
 * @returns {{ isLoading: import('vue').Ref<boolean>, pendingCount: import('vue').Ref<number> }} Reactive loading state and pending count
 */
export function useApiLoading() {
  const isLoading = ref(loadingBus.isLoading)
  const pendingCount = ref(loadingBus.pendingCount)

  let unsubscribe

  onMounted(() => {
    unsubscribe = loadingBus.subscribe((loading, count) => {
      isLoading.value = loading
      pendingCount.value = count
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return { isLoading, pendingCount }
}
