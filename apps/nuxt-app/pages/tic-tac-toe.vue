<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// 遊戲狀態
const moves = ref<{ X: Set<number>, O: Set<number> }>({
  X: new Set(),
  O: new Set(),
})
const winner = ref<string | null>(null)

// 總步數
const totalMoves = computed(() => moves.value.X.size + moves.value.O.size)

// 當前玩家
const currentPlayer = computed(() => totalMoves.value % 2 === 0 ? 'X' : 'O')

// 是否平局
const isDraw = computed(() => totalMoves.value === 9 && !winner.value)

// 勝利組合
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function checkPlayerWin(player: 'X' | 'O'): boolean {
  const playerMoves = moves.value[player]
  for (const combo of winningCombinations) {
    if (combo.every(pos => playerMoves.has(pos)))
      return true
  }
  return false
}

function getCellValue(index: number): string | null {
  if (moves.value.X.has(index))
    return 'X'
  if (moves.value.O.has(index))
    return 'O'
  return null
}

function isOccupied(index: number): boolean {
  return moves.value.X.has(index) || moves.value.O.has(index)
}

function handleClick(index: number) {
  if (isOccupied(index) || winner.value)
    return

  const player = currentPlayer.value as 'X' | 'O'
  moves.value[player].add(index)

  if (checkPlayerWin(player)) {
    winner.value = player
  }
}

function resetGame() {
  moves.value = { X: new Set(), O: new Set() }
  winner.value = null
}

function getCellClass(index: number): Record<string, boolean> {
  const value = getCellValue(index)
  return {
    'text-primary': value === 'X',
    'text-secondary': value === 'O',
  }
}
</script>

<template>
  <div class="flex flex-col items-center py-8">
    <h1 class="text-2xl font-bold mb-6 text-textPrimary">
      圈圈叉叉
    </h1>

    <!-- 遊戲狀態 -->
    <div class="mb-4 text-lg">
      <template v-if="winner">
        <span class="text-primary font-bold">{{ winner }} 獲勝！</span>
      </template>
      <template v-else-if="isDraw">
        <span class="text-warning font-bold">平局！</span>
      </template>
      <template v-else>
        <span class="text-textSecondary">
          輪到 <span :class="currentPlayer === 'X' ? 'text-primary' : 'text-secondary'" class="font-bold">{{ currentPlayer }}</span>
        </span>
      </template>
    </div>

    <!-- 遊戲棋盤 -->
    <div class="grid grid-cols-3 gap-2 mb-6">
      <button
        v-for="(_, index) in 9"
        :key="index"
        class="w-20 h-20 bg-sys-surface border-2 border-sys-border rounded-lg text-4xl font-bold flex-center hover:bg-sys-surface-light transition-colors"
        :class="getCellClass(index)"
        :disabled="isOccupied(index) || !!winner"
        @click="handleClick(index)"
      >
        {{ getCellValue(index) }}
      </button>
    </div>

    <!-- 重新開始 -->
    <q-btn
      color="primary"
      label="重新開始"
      @click="resetGame"
    />

    <!-- 返回首頁 -->
    <NuxtLink to="/" class="mt-4 text-textSecondary hover:text-primary">
      返回首頁
    </NuxtLink>
  </div>
</template>
