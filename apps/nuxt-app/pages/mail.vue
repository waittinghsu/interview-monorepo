<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '郵件中心',
})

interface MailItem {
  id: number
  subject: string
  sender: string
  date: string
  unread: boolean
}

const mailItems: MailItem[] = [
  { id: 1, subject: '歡迎加入 Cyberpunk Studio', sender: 'admin@cyberpunk.com', date: '2026-02-24', unread: true },
  { id: 2, subject: '系統更新通知', sender: 'system@cyberpunk.com', date: '2026-02-23', unread: true },
  { id: 3, subject: '專案進度報告', sender: 'project@cyberpunk.com', date: '2026-02-22', unread: false },
  { id: 4, subject: '團隊會議邀請', sender: 'team@cyberpunk.com', date: '2026-02-21', unread: false },
  { id: 5, subject: '安全性更新提醒', sender: 'security@cyberpunk.com', date: '2026-02-20', unread: false },
]
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-textBase mb-6">
        郵件中心
      </h1>

      <q-list bordered separator class="bg-sys-card rounded-lg">
        <q-item
          v-for="mail in mailItems"
          :key="mail.id"
          v-ripple
          clickable
          class="transition-colors hover:bg-sys-page"
        >
          <q-item-section avatar>
            <q-avatar :color="mail.unread ? 'textBrand' : 'textMuted'" text-color="white" icon="email" />
          </q-item-section>

          <q-item-section>
            <q-item-label :class="mail.unread ? 'font-bold text-textBase' : 'text-textSecondary'">
              {{ mail.subject }}
            </q-item-label>
            <q-item-label caption class="text-textMuted">
              {{ mail.sender }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption class="text-textMuted">
              {{ mail.date }}
            </q-item-label>
            <q-badge v-if="mail.unread" color="textBrand" label="未讀" class="mt-1" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
