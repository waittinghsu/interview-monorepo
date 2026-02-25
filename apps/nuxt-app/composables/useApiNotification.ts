import { useQuasar } from 'quasar'

export function useApiNotification() {
  const $q = useQuasar()

  function showError(message: string) {
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
      timeout: 3000,
    })
  }

  function showSuccess(message: string) {
    $q.notify({
      type: 'positive',
      message,
      position: 'top',
      timeout: 2000,
    })
  }

  function showWarning(message: string) {
    $q.notify({
      type: 'warning',
      message,
      position: 'top',
      timeout: 2500,
    })
  }

  function showInfo(message: string) {
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
