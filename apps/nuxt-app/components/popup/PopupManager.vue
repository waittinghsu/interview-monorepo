<script setup lang="ts">
import type { PopupComponentName } from '~/features/popup'
import { usePopupStore } from '~/stores/popup'
import PopupCyber from './PopupCyber.vue'
import PopupFormInput from './PopupFormInput.vue'
import PopupImageButton from './PopupImageButton.vue'
import PopupImageDisintegrate from './PopupImageDisintegrate.vue'
import PopupRoulette from './PopupRoulette.vue'
import PopupTextAnnouncement from './PopupTextAnnouncement.vue'
import PopupTicTacToe from './PopupTicTacToe.vue'

const popupStore = usePopupStore()

const componentMap: Record<PopupComponentName, unknown> = {
  PopupTextAnnouncement,
  PopupImageButton,
  PopupRoulette,
  PopupTicTacToe,
  PopupCyber,
  PopupFormInput,
  PopupImageDisintegrate,
}

const isOpen = computed(() => !!popupStore.current)

const currentComponent = computed(() => {
  if (!popupStore.current)
    return null
  return componentMap[popupStore.current.component]
})
</script>

<template>
  <q-dialog
    :model-value="isOpen"
    persistent
  >
    <component
      :is="currentComponent"
      v-if="popupStore.current"
      :task="popupStore.current"
      @dismiss="popupStore.dismiss()"
    />
  </q-dialog>
</template>
