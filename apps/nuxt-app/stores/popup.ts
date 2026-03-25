import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { usePopupQueue } from '~/features/popup'

export const usePopupStore = defineStore('popup', () => {
  const userStore = useUserStore()
  const userId = computed(() => String(userStore.user?.memberId ?? 'guest'))
  const { queue, current, insert, dismiss } = usePopupQueue(userId)

  return {
    queue,
    current,
    insert,
    dismiss,
  }
})
