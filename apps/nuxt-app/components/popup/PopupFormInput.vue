<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

const $q = useQuasar()
const phone = ref('')
const message = ref('')

function onSubmit() {
  if (!phone.value.trim()) {
    $q.notify({ type: 'warning', message: '請輸入手機號碼', position: 'top' })
    return
  }
  $q.notify({ type: 'positive', message: '已成功送出！', position: 'top' })
  emit('dismiss')
}
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl">
    <q-card-section class="flex items-center gap-2 border-b border-sys-border">
      <div class="i-mdi-form-textbox text-2xl text-primary" />
      <span class="text-lg font-semibold text-textBase">{{ task.name }}</span>
    </q-card-section>

    <q-card-section class="flex flex-col gap-4">
      <q-input
        v-model="phone"
        outlined
        :label="(task.extra.placeholder as string) ?? '手機號碼'"
        type="tel"
        class="text-textBase"
        input-class="text-textBase"
        label-color="textSecondary"
        @change="(val: string | number | null) => { phone = String(val ?? '') }"
      />
      <q-input
        v-model="message"
        outlined
        label="留言（選填）"
        type="textarea"
        autogrow
        class="text-textBase"
        input-class="text-textBase"
        label-color="textSecondary"
        @change="(val: string | number | null) => { message = String(val ?? '') }"
      />
    </q-card-section>

    <q-card-actions align="right" class="gap-2 px-4 pb-4">
      <q-btn flat label="關閉" class="text-textMuted" @click="emit('dismiss')" />
      <q-btn unelevated label="送出" class="btn-gradient-primary px-6" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>
