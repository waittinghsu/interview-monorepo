<script setup>
const rotateArr = ref(Array.from({ length: 9 }).map((_, i) => i + 1))
const rotator = seatRotate(rotateArr.value)

function seatRotate(arr) {
  const tempArr = arr
  const rotateForward = () => {
    const first = tempArr.shift()
    tempArr.push(first)
  }
  const rotateBackward = () => {
    const last = tempArr.pop()
    tempArr.unshift(last)
  }
  const asGrid = () => {
    const sqrtLength = Math.sqrt(tempArr.length)
    const output = []
    for (let i = 0; i < sqrtLength; i++) {
      const row = []
      for (let j = 0; j < sqrtLength; j++) {
        row.push(tempArr[i * sqrtLength + j])
      }
      output.push(row)
    }
    return output
  }
  const refresh = () => {
  }
  return {
    flatData: tempArr,
    rotateForward,
    rotateBackward,
    asGrid,
    refresh,
  }
}

function rotateForward() {
  const first = rotateArr.value.shift()
  rotateArr.value.push(first)
}
function rotateBackward() {
  const last = rotateArr.value.pop()
  rotateArr.value.unshift(last)
}
function refresh() {
  rotateArr.value = Array.from({ length: 9 }).map((_, i) => i + 1)
}

watch(
  rotateArr,
  (arr) => {
    const idx = arr.indexOf(1)

    if (idx === 0)
      console.log('o')
    else if (idx === 1)
      console.log('m')
    else if (idx === 2)
      console.log('e')
    else if (idx === 3)
      console.log('g')
    else if (idx === 4)
      console.log('a')
    else if (idx === 5)
      console.log('_')
    else if (idx === 6)
      console.log('h')
    else if (idx === 7)
      console.log('a')
    else console.log('index not in 0..7:', idx) // idx 可能是 8 或找不到（-1）
  },
  { deep: true },
)

onMounted(() => {

})
</script>

<template>
  <div class="min-h-screen bg-black text-white p-6">
    <div class="max-w-2xl mx-auto">
      <!-- 標題 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">
          <i class="i-carbon-grid mr-2" />
          array sort
        </h1>
        <p class="text-gray-400">
          xxxxx
        </p>
      </div>

      <!-- 題目說明 -->
      <q-card dark class="bg-gray-900 mb-6">
        <q-card-section>
          <div class="text-subtitle1 text-cyan-400 mb-2">
            xxxxx
          </div>
          <p class="text-gray-300">
            xxxxx
          </p>
          <p class="text-gray-400 text-sm mt-2">
            <i class="i-carbon-information mr-1" />
            xxxxx
          </p>
        </q-card-section>
      </q-card>

      <!-- 座位控制 -->
      <div class="flex justify-center gap-4 mb-6">
        <q-btn
          outline
          color="cyan"
          icon="remove"
          label="正序座位"
          @click="rotateForward"
        />
        <q-btn
          outline
          color="cyan"
          icon="add"
          label="反序座位"
          @click="rotateBackward"
        />
      </div>

      <!-- 九宮格座位 -->
      <div class="flex justify-center mb-8">
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${Math.min(3, 6)}, 1fr)` }">
          <div
            v-for="(seat, index) in rotateArr"
            :key="index"
            class="w-16 h-16 rounded-lg flex-center cursor-pointer transition-all duration-300 border-2"
          >
            <div class="text-center">
              <i
                v-if="seat === 1"
                class="i-carbon-user-filled text-2xl text-red-500"
              />
              <!--              <i class="i-carbon-checkmark text-2xl"/> -->
              <span v-else class="text-gray-400">{{ seat }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 陣列顯示 -->
      <div class="text-center mb-6">
        <code class="bg-gray-800 px-4 py-2 rounded text-cyan-400">
          seats =  {{ rotateArr }}
        </code>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-center gap-4 mb-8">
        <q-btn
          color="cyan"
          icon="calculate"
          label="計算位置"
        />
        <q-btn
          outline
          color="grey"
          icon="refresh"
          label="重置"
          @click="refresh"
        />
      </div>

      <!-- 結果顯示 -->
      <q-card dark class="bg-gray-900">
        <q-card-section>
          <div class="text-h6 text-green-400 mb-4">
            <i class="i-carbon-checkmark-filled mr-2" />
            計算結果
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-800 p-4 rounded-lg text-center">
              <div class="text-gray-400 text-sm">
                二為陣列
              </div>
              <div class="text-sm font-bold text-cyan-400">
                <pre>{{ rotator.asGrid().join('\n') }}</pre>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
