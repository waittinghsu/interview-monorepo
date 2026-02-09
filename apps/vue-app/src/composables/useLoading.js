/**
 * 通用 Loading 狀態管理
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState)

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  async function withLoading(fn) {
    startLoading()
    try {
      return await fn()
    }
    finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
