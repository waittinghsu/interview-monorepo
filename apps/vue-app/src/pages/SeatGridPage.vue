<script setup>
const seats = ref([1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1])
const selectedSeat = ref(null)
const result = ref(null)

// 計算最大距離
function maxDistToClosest(seatsArr) {
  const n = seatsArr.length
  let maxDist = 0
  let lastPerson = -1
  let bestSeat = 0

  for (let i = 0; i < n; i++) {
    if (seatsArr[i] === 1) {
      if (lastPerson === -1) {
        if (i > maxDist) {
          maxDist = i
          bestSeat = 0
        }
      }
      else {
        const dist = Math.floor((i - lastPerson) / 2)
        if (dist > maxDist) {
          maxDist = dist
          bestSeat = lastPerson + dist
        }
      }
      lastPerson = i
    }
  }

  // 結尾空位
  const endDist = n - 1 - lastPerson
  if (endDist > maxDist) {
    maxDist = endDist
    bestSeat = n - 1
  }

  return { maxDist, bestSeat }
}

// 選擇座位
function selectSeat(index) {
  if (seats.value[index] === 1)
    return
  selectedSeat.value = index
}

// 切換座位狀態（有人/空）
function toggleSeat(index) {
  seats.value[index] = seats.value[index] === 1 ? 0 : 1
  selectedSeat.value = null
  result.value = null
}

// 計算答案
function solve() {
  result.value = maxDistToClosest(seats.value)
  selectedSeat.value = result.value.bestSeat
}

// 重置
function reset() {
  seats.value = [1, 0, 0, 0, 1, 0, 1]
  selectedSeat.value = null
  result.value = null
}

// 增加座位
function addSeat() {
  if (seats.value.length < 12) {
    seats.value.push(0)
  }
}

// 減少座位
function removeSeat() {
  if (seats.value.length > 3) {
    seats.value.pop()
    if (selectedSeat.value >= seats.value.length) {
      selectedSeat.value = null
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white p-6">
    <div class="max-w-2xl mx-auto">
      <!-- 標題 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">
          <i class="i-carbon-grid mr-2" />
          Maximize Distance to Closest Person
        </h1>
        <p class="text-gray-400">
          LeetCode 849 - 座位距離最大化
        </p>
      </div>

      <!-- 題目說明 -->
      <q-card dark class="bg-gray-900 mb-6">
        <q-card-section>
          <div class="text-subtitle1 text-cyan-400 mb-2">
            題目說明
          </div>
          <p class="text-gray-300">
            點擊空位選擇座位，或點擊「計算最佳位置」找出與最近的人距離最大的座位。
          </p>
          <p class="text-gray-400 text-sm mt-2">
            <i class="i-carbon-information mr-1" />
            雙擊座位可切換有人/空位
          </p>
        </q-card-section>
      </q-card>

      <!-- 座位控制 -->
      <div class="flex justify-center gap-4 mb-6">
        <q-btn
          outline
          color="cyan"
          icon="remove"
          label="減少座位"
          :disable="seats.length <= 3"
          @click="removeSeat"
        />
        <q-btn
          outline
          color="cyan"
          icon="add"
          label="增加座位"
          :disable="seats.length >= 12"
          @click="addSeat"
        />
      </div>

      <!-- 九宮格座位 -->
      <div class="flex justify-center mb-8">
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${Math.min(seats.length, 6)}, 1fr)` }">
          <div
            v-for="(seat, index) in seats"
            :key="index"
            class="w-16 h-16 rounded-lg flex-center cursor-pointer transition-all duration-300 border-2"
            :class="[
              seat === 1
                ? 'bg-red-600 border-red-400'
                : selectedSeat === index
                  ? 'bg-green-600 border-green-400 scale-110'
                  : 'bg-gray-700 border-gray-500 hover:border-cyan-400',
            ]"
            @click="selectSeat(index)"
            @dblclick="toggleSeat(index)"
          >
            <div class="text-center">
              <i
                v-if="seat === 1"
                class="i-carbon-user-filled text-2xl"
              />
              <i
                v-else-if="selectedSeat === index"
                class="i-carbon-checkmark text-2xl"
              />
              <span v-else class="text-gray-400">{{ index }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 陣列顯示 -->
      <div class="text-center mb-6">
        <code class="bg-gray-800 px-4 py-2 rounded text-cyan-400">
          seats = [{{ seats.join(', ') }}]
        </code>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-center gap-4 mb-8">
        <q-btn
          color="cyan"
          icon="calculate"
          label="計算最佳位置"
          @click="solve"
        />
        <q-btn
          outline
          color="grey"
          icon="refresh"
          label="重置"
          @click="reset"
        />
      </div>

      <!-- 結果顯示 -->
      <q-card v-if="result" dark class="bg-gray-900">
        <q-card-section>
          <div class="text-h6 text-green-400 mb-4">
            <i class="i-carbon-checkmark-filled mr-2" />
            計算結果
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-800 p-4 rounded-lg text-center">
              <div class="text-gray-400 text-sm">
                最佳座位
              </div>
              <div class="text-3xl font-bold text-cyan-400">
                {{ result.bestSeat }}
              </div>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg text-center">
              <div class="text-gray-400 text-sm">
                最大距離
              </div>
              <div class="text-3xl font-bold text-green-400">
                {{ result.maxDist }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 圖例 -->
      <div class="mt-8 flex justify-center gap-6 text-sm text-gray-400">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-red-600 rounded" />
          <span>有人</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-700 rounded" />
          <span>空位</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-green-600 rounded" />
          <span>選中</span>
        </div>
      </div>
    </div>
  </div>
</template>
