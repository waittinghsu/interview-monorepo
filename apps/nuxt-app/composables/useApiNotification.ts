import { useQuasar } from 'quasar'

export function useApiNotification() {
  const $q = useQuasar()

  function showError(message: string) {
    // 安全檢查：確保在客戶端且 Quasar 已初始化
    if (!import.meta.client || !$q?.notify) {
      console.error('[API Error]', message)
      return
    }

    $q.notify({
      type: 'negative',
      message,
      position: 'top',
      timeout: 3000,
    })
  }

  function showSuccess(message: string) {
    if (!import.meta.client || !$q?.notify) {
      console.log('[API Success]', message)
      return
    }

    $q.notify({
      type: 'positive',
      message,
      position: 'top',
      timeout: 2000,
    })
  }

  function showWarning(message: string) {
    if (!import.meta.client || !$q?.notify) {
      console.warn('[API Warning]', message)
      return
    }

    $q.notify({
      type: 'warning',
      message,
      position: 'top',
      timeout: 2500,
    })
  }

  function showInfo(message: string) {
    if (!import.meta.client || !$q?.notify) {
      console.info('[API Info]', message)
      return
    }

    $q.notify({
      type: 'info',
      message,
      position: 'top',
      timeout: 2000,
    })
  }

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }
}
