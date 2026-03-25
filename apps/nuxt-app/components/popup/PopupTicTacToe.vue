<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

const $q = useQuasar()

type Cell = 'X' | 'O' | null
const board = ref<Cell[]>(Array.from<Cell>({ length: 9 }).fill(null))
const gameOver = ref(false)
const status = ref('你是 O，請先手')

const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function checkWinner(b: Cell[]): Cell | 'draw' | null {
  for (const [a, i, c] of lines) {
    if (b[a] && b[a] === b[i] && b[a] === b[c])
      return b[a]
  }
  if (b.every(c => c !== null))
    return 'draw'
  return null
}

function handleGameEnd(result: Cell | 'draw') {
  gameOver.value = true
  if (result === 'O') {
    status.value = '你贏了！🎉'
    $q.notify({ type: 'positive', message: '恭喜你贏了！', position: 'top' })
  }
  else if (result === 'X') {
    status.value = 'AI 贏了 😅'
    $q.notify({ type: 'negative', message: 'AI 獲勝，再試一次！', position: 'top' })
  }
  else {
    status.value = '平局！🤝'
    $q.notify({ type: 'warning', message: '平局！勢均力敵！', position: 'top' })
  }
  setTimeout(() => emit('dismiss'), 1500)
}

function aiMove() {
  const empty = board.value.map((c, i) => c === null ? i : -1).filter(i => i !== -1)
  if (empty.length === 0)
    return
  const idx = empty[Math.floor(Math.random() * empty.length)]
  board.value[idx] = 'X'
  const result = checkWinner(board.value)
  if (result)
    handleGameEnd(result)
  else status.value = '你的回合 (O)'
}

function playerMove(idx: number) {
  if (board.value[idx] || gameOver.value)
    return
  board.value[idx] = 'O'
  const result = checkWinner(board.value)
  if (result) {
    handleGameEnd(result)
    return
  }
  status.value = 'AI 思考中...'
  setTimeout(aiMove, 400)
}

function restart() {
  board.value = Array.from<Cell>({ length: 9 }).fill(null)
  gameOver.value = false
  status.value = '你是 O，請先手'
}
</script>

<template>
  <q-card class="bg-sys-card w-80 max-w-full rounded-2xl">
    <q-card-section class="flex items-center gap-2 border-b border-sys-border">
      <div class="i-mdi-gamepad-variant text-2xl text-primary" />
      <span class="text-lg font-semibold text-textBase">圈圈叉叉</span>
    </q-card-section>

    <q-card-section class="flex flex-col items-center gap-4">
      <p class="text-sm text-textSecondary">
        {{ status }}
      </p>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="(cell, i) in board"
          :key="i"
          class="w-20 h-20 rounded-xl bg-sys-raised text-3xl font-bold flex items-center justify-center transition-all hover:bg-sys-page"
          :class="{
            'text-primary': cell === 'O',
            'text-secondary': cell === 'X',
            'cursor-not-allowed': !!cell || gameOver,
          }"
          :disabled="!!cell || gameOver"
          @click="playerMove(i)"
        >
          {{ cell }}
        </button>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="gap-2 px-4 pb-4">
      <q-btn flat label="重來" class="text-textMuted" @click="restart" />
      <q-btn flat label="關閉" class="text-textMuted" @click="emit('dismiss')" />
    </q-card-actions>
  </q-card>
</template>
