<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '猜數字遊戲',
})

const ANSWER_LENGTH = 4
const MAX_ATTEMPTS = 10

type GuessRecord = {
  id: number
  guess: string
  result: string
}

const answer = ref(generateAnswer())
const currentGuess = ref('')
const history = ref<GuessRecord[]>([])
const status = ref<'playing' | 'won' | 'lost'>('playing')
const validationMessage = ref('')

const attemptsLeft = computed(() => Math.max(MAX_ATTEMPTS - history.value.length, 0))
const isGameOver = computed(() => status.value !== 'playing')

function generateAnswer(): string {
  return Array.from({ length: ANSWER_LENGTH }, () => Math.floor(Math.random() * 10)).join('')
}

function handleInput(value: string) {
  currentGuess.value = value.replace(/\D/g, '').slice(0, ANSWER_LENGTH)
}

function evaluateGuess(secret: string, guess: string) {
  let a = 0
  let b = 0
  const secretCounts = Array(10).fill(0)
  const guessCounts = Array(10).fill(0)

  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (secret[i] === guess[i]) {
      a++
    }
    else {
      secretCounts[Number(secret[i])]++
      guessCounts[Number(guess[i])]++
    }
  }

  for (let i = 0; i < 10; i++)
    b += Math.min(secretCounts[i], guessCounts[i])

  return { a, b }
}

function submitGuess() {
  if (isGameOver.value)
    return

  if (currentGuess.value.length !== ANSWER_LENGTH) {
    validationMessage.value = `請輸入 ${ANSWER_LENGTH} 位數字`
    return
  }

  validationMessage.value = ''
  const guess = currentGuess.value
  const { a, b } = evaluateGuess(answer.value, guess)

  history.value = [
    { id: Date.now(), guess, result: `${a}a${b}b` },
    ...history.value,
  ]

  if (a === ANSWER_LENGTH) {
    status.value = 'won'
  }
  else if (history.value.length >= MAX_ATTEMPTS) {
    status.value = 'lost'
  }

  currentGuess.value = ''
}

function resetGame() {
  answer.value = generateAnswer()
  currentGuess.value = ''
  history.value = []
  status.value = 'playing'
  validationMessage.value = ''
}
</script>

<template>
  <div class="p-4">
    <div class="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-bold mb-2 text-textPrimary">
          猜數字遊戲
        </h1>
        <p class="text-textSecondary">
          在 {{ MAX_ATTEMPTS }} 次內猜出系統隨機產生的 {{ ANSWER_LENGTH }} 位數字，輸入會自動限制為數字。
        </p>
      </div>

      <div class="bg-sys-surface border border-sys-border rounded-lg p-5 space-y-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-end">
          <q-input
            :model-value="currentGuess"
            :disable="isGameOver"
            label="輸入 4 位數字"
            filled
            maxlength="4"
            inputmode="numeric"
            class="flex-1"
            @update:model-value="handleInput"
          />
          <div class="flex gap-2">
            <q-btn color="primary" label="送出" :disable="isGameOver" @click="submitGuess" />
            <q-btn outline color="secondary" label="重置" @click="resetGame" />
          </div>
        </div>

        <div class="text-sm text-textSecondary">
          目前已猜 {{ history.length }} 次，剩餘 {{ attemptsLeft }} 次。
        </div>

        <q-banner v-if="validationMessage" class="bg-warning text-white">
          {{ validationMessage }}
        </q-banner>

        <q-banner v-if="status === 'won'" class="bg-primary text-white">
          太厲害了！你猜中了！
        </q-banner>
        <q-banner v-else-if="status === 'lost'" class="bg-negative text-white">
          已達最大次數，答案是 <strong class="ml-1">{{ answer }}</strong>
        </q-banner>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-sys-surface border border-sys-border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-3 text-textPrimary">
            遊戲規則
          </h2>
          <ul class="list-disc list-inside text-textSecondary space-y-2 text-sm">
            <li>結果中的 <strong>a</strong> 代表數字與位置都正確。</li>
            <li><strong>b</strong> 代表數字正確但位置不對。</li>
            <li>答案允許重複數字，例如 0012。</li>
            <li>最多 {{ MAX_ATTEMPTS }} 次機會，善用歷史紀錄推理。</li>
          </ul>
        </div>
        <div class="bg-sys-surface border border-sys-border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-3 text-textPrimary">
            猜測紀錄
          </h2>
          <p v-if="history.length === 0" class="text-textSecondary text-sm">
            尚無紀錄，試著輸入第一個答案吧！
          </p>
          <div v-else class="space-y-2">
            <div
              v-for="record in history"
              :key="record.id"
              class="flex items-center justify-between rounded-md bg-sys-background p-3 font-mono"
            >
              <span class="tracking-widest text-lg">{{ record.guess }}</span>
              <span class="text-primary font-semibold">{{ record.result }}</span>
            </div>
          </div>
        </div>
      </div>

      <NuxtLink to="/" class="text-primary hover:underline inline-flex items-center gap-1">
        <span class="i-mdi-arrow-left" /> 回到首頁
      </NuxtLink>
    </div>
  </div>
</template>
