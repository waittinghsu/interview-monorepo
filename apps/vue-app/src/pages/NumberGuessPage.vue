<script setup>
const ANSWER_LENGTH = 4
const MAX_ATTEMPTS = 10

const answer = ref(generateAnswer())
const currentGuess = ref('')
const history = ref([])
const gameStatus = ref('playing') // playing | won | lost
const validationMessage = ref('')

const attemptsUsed = computed(() => history.value.length)
const attemptsLeft = computed(() => Math.max(MAX_ATTEMPTS - attemptsUsed.value, 0))
const isGameOver = computed(() => gameStatus.value !== 'playing')

function generateAnswer() {
  return Array.from({ length: ANSWER_LENGTH }, () => Math.floor(Math.random() * 10)).join('')
}

function handleInput(value) {
  currentGuess.value = value.replace(/\D/g, '').slice(0, ANSWER_LENGTH)
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
    { id: `${Date.now()}-${Math.random()}`, guess, result: `${a}a${b}b` },
    ...history.value,
  ]

  if (a === ANSWER_LENGTH) {
    gameStatus.value = 'won'
  }
  else if (history.value.length >= MAX_ATTEMPTS) {
    gameStatus.value = 'lost'
  }

  currentGuess.value = ''
}

function evaluateGuess(secret, guess) {
  let a = 0
  let b = 0
  const secretCounts = Array.from({ length: 10 }).fill(0)
  const guessCounts = Array.from({ length: 10 }).fill(0)

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

function resetGame() {
  answer.value = generateAnswer()
  currentGuess.value = ''
  history.value = []
  gameStatus.value = 'playing'
  validationMessage.value = ''
}
</script>

<template>
  <div class="max-w-xl mx-auto py-8 px-4 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-textBase mb-2">
        猜數字遊戲
      </h1>
      <p class="text-textSecondary">
        系統會隨機產生 {{ ANSWER_LENGTH }} 位數字，嘗試在 {{ MAX_ATTEMPTS }} 次內猜對！
      </p>
    </div>

    <div class="bg-sys-card border border-sys-border rounded-lg p-4 space-y-3">
      <div class="flex flex-col gap-3 md:flex-row md:items-end">
        <q-input
          :model-value="currentGuess"
          :disable="isGameOver"
          label="輸入 4 位數字"
          filled
          dark
          maxlength="4"
          inputmode="numeric"
          class="flex-1"
          input-class="text-textBrand font-mono tracking-widest text-lg"
          @update:model-value="handleInput"
        />
        <div class="flex gap-2">
          <q-btn unelevated :disable="isGameOver" class="btn-gradient-primary" label="送出" @click="submitGuess" />
          <q-btn outline color="warning" label="重置" @click="resetGame" />
        </div>
      </div>

      <div class="text-sm text-textSecondary">
        已猜 {{ attemptsUsed }} 次，剩餘 {{ attemptsLeft }} 次。
      </div>

      <q-banner v-if="validationMessage" inline-actions class="bg-warning text-white">
        {{ validationMessage }}
      </q-banner>

      <q-banner v-if="gameStatus === 'won'" class="bg-primary text-white">
        恭喜答對！
      </q-banner>
      <q-banner v-else-if="gameStatus === 'lost'" class="bg-negative text-white">
        挑戰失敗，答案是 <strong class="ml-1">{{ answer }}</strong>
      </q-banner>
    </div>

    <div class="bg-sys-card border border-sys-border rounded-lg p-4">
      <h2 class="text-lg font-semibold text-textBase mb-3">
        猜測紀錄
      </h2>
      <p v-if="history.length === 0" class="text-textSecondary">
        尚無紀錄，開始猜猜看吧！
      </p>
      <div v-else class="space-y-2">
        <div
          v-for="record in history"
          :key="record.id"
          class="flex items-center justify-between rounded-md bg-sys-page p-3"
        >
          <span class="font-mono tracking-widest text-lg">{{ record.guess }}</span>
          <span class="text-primary font-semibold">{{ record.result }}</span>
        </div>
      </div>
    </div>

    <div class="text-sm text-textSecondary">
      <p>提示：</p>
      <ul class="list-disc list-inside space-y-1">
        <li>結果中的 <strong>a</strong> 代表數字與位置都正確。</li>
        <li><strong>b</strong> 代表數字正確但位置不對。</li>
        <li>輸入僅接受數字，超過四位會自動截斷。</li>
      </ul>
    </div>

    <router-link :to="{ name: 'Home' }" class="text-primary hover:underline">
      返回首頁
    </router-link>
  </div>
</template>
