import { defineStore } from 'pinia'
import { computed } from 'vue'
import { usePopupQueue } from '~/features/popup'
import { useUserStore } from './user'

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
