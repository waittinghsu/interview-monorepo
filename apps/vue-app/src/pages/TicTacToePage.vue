<script setup>
// 遊戲狀態 - 使用物件分別存放 X 和 O 的位置
const moves = ref({
  X: new Set(),
  O: new Set(),
})
const winner = ref(null)

// 總步數
const totalMoves = computed(() => moves.value.X.size + moves.value.O.size)

// 當前玩家（偶數步 → X，奇數步 → O）
const currentPlayer = computed(() => totalMoves.value % 2 === 0 ? 'X' : 'O')

// 是否平局
const isDraw = computed(() => totalMoves.value === 9 && !winner.value)

// 勝利組合
const winningCombinations = [
  [0, 1, 2], // 上
  [3, 4, 5], // 中
  [6, 7, 8], // 下
  [0, 3, 6], // 左
  [1, 4, 7], // 中
  [2, 5, 8], // 右
  [0, 4, 8], // 對角
  [2, 4, 6], // 反對
]

// 檢查指定玩家是否勝利（使用 Set.has() 是 O(1)）
function checkPlayerWin(player) {
  const playerMoves = moves.value[player]
  for (const combo of winningCombinations) {
    if (combo.every(pos => playerMoves.has(pos)))
      return true
  }
  return false
}

// 取得格子的值
function getCellValue(index) {
  if (moves.value.X.has(index))
    return 'X'
  if (moves.value.O.has(index))
    return 'O'
  return null
}

// 檢查格子是否已被佔用
function isOccupied(index) {
  return moves.value.X.has(index) || moves.value.O.has(index)
}

// 點擊格子
function handleClick(index) {
  if (isOccupied(index) || winner.value)
    return

  // 記錄當前玩家的位置
  const player = currentPlayer.value
  moves.value[player].add(index)

  // 檢查是否獲勝
  if (checkPlayerWin(player)) {
    winner.value = player
  }
}

// 重新開始
function resetGame() {
  moves.value = {
    X: new Set(),
    O: new Set(),
  }
  winner.value = null
}

// 取得格子樣式
function getCellClass(index) {
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

    <!-- 重新開始按鈕 -->
    <q-btn
      color="primary"
      label="重新開始"
      @click="resetGame"
    />

    <!-- 返回首頁 -->
    <router-link :to="{ name: 'Home' }" class="mt-4 text-textSecondary hover:text-primary">
      返回首頁
    </router-link>
  </div>
</template>
