<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-dark.css'

const props = withDefaults(defineProps<Props>(), {
  language: 'json',
})

// 註冊 JSON 語言
hljs.registerLanguage('json', json)

interface Props {
  code: string
  language?: string
}

const highlighted = computed(() => {
  return hljs.highlight(props.code, { language: props.language }).value
})

// 複製功能
const { copy, copied } = useClipboard()

async function copyCode() {
  await copy(props.code)
}
</script>

<template>
  <div class="code-viewer">
    <!-- 複製按鈕 -->
    <div class="flex justify-end mb-2">
      <q-btn
        dense
        outline
        size="sm"
        :icon="copied ? 'check' : 'content_copy'"
        :label="copied ? '已複製' : '複製'"
        @click="copyCode"
      />
    </div>

    <!-- Code 顯示區 -->
    <pre class="hljs"><code v-html="highlighted" /></pre>
  </div>
</template>

<style scoped>
.code-viewer {
  position: relative;
}

pre.hljs {
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
  background-color: #282c34; /* atom-one-dark background */
}

code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
