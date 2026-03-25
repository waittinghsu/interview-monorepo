<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

const $q = useQuasar()

const prizes = ['大獎 🎁', '二獎 🥈', '三獎 🥉', '幸運獎 ⭐', '參與獎 🎊', '再接再厲 💪']
const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']

const spinning = ref(false)
const rotation = ref(0)
const result = ref('')

function spin() {
  if (spinning.value)
    return
  spinning.value = true
  result.value = ''

  const extraSpins = 5 * 360
  const sectionAngle = 360 / prizes.length
  const winIdx = Math.floor(Math.random() * prizes.length)
  const targetAngle = extraSpins + (360 - winIdx * sectionAngle - sectionAngle / 2)

  rotation.value += targetAngle

  setTimeout(() => {
    spinning.value = false
    result.value = prizes[winIdx]
    $q.notify({
      type: 'positive',
      message: `恭喜獲得：${prizes[winIdx]}`,
      position: 'top',
      timeout: 2000,
    })
    setTimeout(() => emit('dismiss'), 1500)
  }, 3000)
}

const sectorPath = computed(() => {
  const r = 100
  const cx = 110
  const cy = 110
  const sectionAngle = 360 / prizes.length
  return prizes.map((_, i) => {
    const startAngle = (i * sectionAngle - 90) * (Math.PI / 180)
    const endAngle = ((i + 1) * sectionAngle - 90) * (Math.PI / 180)
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`
  })
})

const labelTransforms = computed(() => {
  const r = 65
  const cx = 110
  const cy = 110
  const sectionAngle = 360 / prizes.length
  return prizes.map((_, i) => {
    const midAngle = ((i + 0.5) * sectionAngle - 90) * (Math.PI / 180)
    const x = cx + r * Math.cos(midAngle)
    const y = cy + r * Math.sin(midAngle)
    const rotate = (i + 0.5) * sectionAngle
    return { x, y, rotate }
  })
})
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl">
    <q-card-section class="flex items-center justify-between border-b border-sys-border">
      <div class="flex items-center gap-2">
        <div class="i-mdi-slot-machine text-2xl text-primary" />
        <span class="text-lg font-semibold text-textBase">{{ task.name }}</span>
      </div>
    </q-card-section>

    <q-card-section class="flex flex-col items-center gap-4">
      <!-- Pointer -->
      <div class="relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500" style="border-bottom-width: 20px;" />

        <!-- Wheel -->
        <svg
          :width="220"
          :height="220"
          class="transition-transform duration-[3000ms] ease-out"
          :style="{ transform: `rotate(${rotation}deg)` }"
        >
          <g>
            <path
              v-for="(path, i) in sectorPath"
              :key="i"
              :d="path"
              :fill="colors[i]"
              stroke="white"
              stroke-width="2"
            />
            <text
              v-for="(t, i) in labelTransforms"
              :key="`label-${i}`"
              :x="t.x"
              :y="t.y"
              :transform="`rotate(${t.rotate}, ${t.x}, ${t.y})`"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="white"
              font-size="10"
              font-weight="bold"
            >
              {{ prizes[i] }}
            </text>
          </g>
          <circle cx="110" cy="110" r="12" fill="white" stroke="#e5e7eb" stroke-width="2" />
        </svg>
      </div>

      <div v-if="result" class="text-lg font-bold text-primary animate-bounce">
        {{ result }}
      </div>
    </q-card-section>

    <q-card-actions align="center" class="pb-4">
      <q-btn
        unelevated
        :label="spinning ? '轉動中...' : '轉動輪盤！'"
        :disable="spinning"
        class="btn-gradient-primary px-8"
        @click="spin"
      />
    </q-card-actions>
  </q-card>
</template>
