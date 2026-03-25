import type { Ref } from 'vue'
import type { PopupTask, UserPopupState } from '../types/popup.types'
import { ref, toValue, watch } from 'vue'

// localStorage helpers: once_ever / once_daily / once_weekly
function getUserState(uid: string): UserPopupState {
  try {
    return JSON.parse(localStorage.getItem(`popup_state_${uid}`) ?? '{}')
  }
  catch {
    return {}
  }
}

function setUserState(uid: string, state: UserPopupState): void {
  localStorage.setItem(`popup_state_${uid}`, JSON.stringify(state))
}

// localStorage helpers: once_per_login
function getPerLogin(uid: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`popup_per_login_${uid}`) ?? '[]')
  }
  catch {
    return []
  }
}

function setPerLogin(uid: string, keys: string[]): void {
  localStorage.setItem(`popup_per_login_${uid}`, JSON.stringify(keys))
}

export function clearPerLoginRecord(uid: string): void {
  localStorage.removeItem(`popup_per_login_${uid}`)
}

// Returns ISO string of current Monday 00:00:00
function getCurrentMondayISO(): string {
  const today = new Date()
  const day = today.getDay() // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

export function canShow(task: PopupTask, uid: string): boolean {
  if (task.displayRule === 'unlimited')
    return true

  if (task.displayRule === 'once_per_login') {
    if (uid === 'guest')
      return true
    return !getPerLogin(uid).includes(task.key)
  }

  const record = getUserState(uid)[task.key]
  if (!record)
    return true

  if (task.displayRule === 'once_ever')
    return false

  if (task.displayRule === 'once_daily') {
    const daysDiff = (Date.now() - new Date(record.shownAt).getTime()) / 86_400_000
    return daysDiff >= 1
  }

  if (task.displayRule === 'once_weekly') {
    return new Date(record.shownAt) < new Date(getCurrentMondayISO())
  }

  return true
}

export function markAsShown(task: PopupTask, uid: string): void {
  if (task.displayRule === 'unlimited')
    return

  if (task.displayRule === 'once_per_login') {
    if (uid === 'guest')
      return
    const seen = getPerLogin(uid)
    if (!seen.includes(task.key))
      setPerLogin(uid, [...seen, task.key])
    return
  }

  const state = getUserState(uid)
  state[task.key] = {
    shownAt: new Date().toISOString(),
    shownCount: (state[task.key]?.shownCount ?? 0) + 1,
  }
  setUserState(uid, state)
}

export function usePopupQueue(userId: Ref<string> | string = 'guest') {
  const queue = ref<PopupTask[]>([])
  const current = ref<PopupTask | null>(null)

  function getUid(): string {
    return toValue(userId)
  }

  function processNext(): void {
    const uid = getUid()
    const idx = queue.value.findIndex(t => canShow(t, uid))
    if (idx === -1) {
      current.value = null
      return
    }
    const [task] = queue.value.splice(idx, 1)
    current.value = task
  }

  function insert(task: PopupTask): void {
    if (current.value?.key === task.key)
      return
    if (queue.value.some(t => t.key === task.key))
      return

    const idx = queue.value.findIndex(t => t.priority < task.priority)
    if (idx === -1) {
      queue.value.push(task)
    }
    else {
      queue.value.splice(idx, 0, task)
    }

    if (!current.value) {
      processNext()
    }
  }

  function dismiss(): void {
    if (current.value) {
      markAsShown(current.value, getUid())
    }
    current.value = null
    setTimeout(() => processNext(), 1000)
  }

  // Watch for userId changes (login/logout)
  watch(() => toValue(userId), (newId, oldId) => {
    if (newId !== oldId) {
      if (newId !== 'guest') {
        clearPerLoginRecord(newId)
      }
      queue.value = []
      current.value = null
    }
  })

  return {
    queue,
    current,
    insert,
    dismiss,
    processNext,
  }
}
