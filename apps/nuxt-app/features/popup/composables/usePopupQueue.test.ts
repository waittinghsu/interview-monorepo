import type { PopupTask } from '../types/popup.types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { canShow, clearPerLoginRecord, markAsShown, usePopupQueue } from './usePopupQueue'

function makeTask(key: string, priority: number, displayRule: PopupTask['displayRule'] = 'unlimited'): PopupTask {
  return {
    key,
    name: key,
    priority,
    displayRule,
    component: 'PopupTextAnnouncement',
    extra: {},
  }
}

describe('usePopupQueue', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('insert 按 priority 降序排序', () => {
    const { queue, current, insert } = usePopupQueue('user1')
    insert(makeTask('a', 10)) // first → becomes current via processNext
    insert(makeTask('b', 50))
    insert(makeTask('c', 30))
    expect(current.value?.key).toBe('a')
    expect(queue.value[0].key).toBe('b')
    expect(queue.value[1].key).toBe('c')
  })

  it('insert 相同 key 不重複', () => {
    const { queue, insert } = usePopupQueue('user1')
    insert(makeTask('a', 10)) // becomes current
    insert(makeTask('b', 20))
    insert(makeTask('b', 20)) // duplicate
    expect(queue.value).toHaveLength(1)
    expect(queue.value[0].key).toBe('b')
  })

  it('canShow - once_ever: 首次 true，二次 false', () => {
    const uid = 'user1'
    const task = makeTask('test', 10, 'once_ever')
    expect(canShow(task, uid)).toBe(true)
    markAsShown(task, uid)
    expect(canShow(task, uid)).toBe(false)
  })

  it('canShow - once_daily: 同天 false，隔天 true', () => {
    const uid = 'user1'
    const task = makeTask('test', 10, 'once_daily')
    // shownAt = now → false
    const state = { test: { shownAt: new Date().toISOString(), shownCount: 1 } }
    localStorage.setItem(`popup_state_${uid}`, JSON.stringify(state))
    expect(canShow(task, uid)).toBe(false)
    // shownAt = old date → true
    const oldState = { test: { shownAt: '2000-01-01T00:00:00.000Z', shownCount: 1 } }
    localStorage.setItem(`popup_state_${uid}`, JSON.stringify(oldState))
    expect(canShow(task, uid)).toBe(true)
  })

  it('canShow - unlimited: 永遠 true', () => {
    const task = makeTask('test', 10, 'unlimited')
    expect(canShow(task, 'user1')).toBe(true)
    expect(canShow(task, 'user1')).toBe(true)
  })

  it('dismiss 後自動顯示下一個', () => {
    const { current, insert, dismiss } = usePopupQueue('user1')
    insert(makeTask('a', 10))
    insert(makeTask('b', 50))
    expect(current.value?.key).toBe('a')
    dismiss()
    expect(current.value).toBeNull()
    vi.advanceTimersByTime(1000)
    expect(current.value?.key).toBe('b')
  })

  it('queue 空時 current 為 null', () => {
    const { current, queue } = usePopupQueue('user1')
    expect(current.value).toBeNull()
    expect(queue.value).toHaveLength(0)
  })

  // New tests for once_weekly
  it('canShow - once_weekly: shownAt 在本週一之前 → true', () => {
    const uid = 'user1'
    const task = makeTask('weekly', 10, 'once_weekly')
    // Set shownAt to last Monday (7 days ago)
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const state = { weekly: { shownAt: lastWeek.toISOString(), shownCount: 1 } }
    localStorage.setItem(`popup_state_${uid}`, JSON.stringify(state))
    expect(canShow(task, uid)).toBe(true)
  })

  it('canShow - once_weekly: shownAt 在本週一之後 → false', () => {
    const uid = 'user1'
    const task = makeTask('weekly', 10, 'once_weekly')
    // Set shownAt to today (after this Monday)
    const state = { weekly: { shownAt: new Date().toISOString(), shownCount: 1 } }
    localStorage.setItem(`popup_state_${uid}`, JSON.stringify(state))
    expect(canShow(task, uid)).toBe(false)
  })

  // New tests for once_per_login
  it('canShow - once_per_login: 同用戶第二次 → false', () => {
    const uid = 'user1'
    const task = makeTask('login-popup', 10, 'once_per_login')
    expect(canShow(task, uid)).toBe(true)
    markAsShown(task, uid)
    expect(canShow(task, uid)).toBe(false)
  })

  it('canShow - once_per_login: guest 用戶 → 永遠 true', () => {
    const task = makeTask('login-popup', 10, 'once_per_login')
    markAsShown(task, 'guest')
    expect(canShow(task, 'guest')).toBe(true)
    expect(canShow(task, 'guest')).toBe(true)
  })

  it('userId 切換（登入）→ queue/current 重置，per_login 記錄清除', async () => {
    const userId = ref('guest')
    const { queue, current, insert } = usePopupQueue(userId)

    insert(makeTask('a', 10))
    insert(makeTask('b', 20))
    expect(current.value?.key).toBe('a')

    // Simulate login: set per_login record for new user first
    const loginTask = makeTask('login-popup', 10, 'once_per_login')
    markAsShown(loginTask, 'member123')
    expect(canShow(loginTask, 'member123')).toBe(false)

    // Switch userId (login)
    userId.value = 'member123'
    await Promise.resolve() // allow watch to fire

    // Queue and current should be reset
    expect(current.value).toBeNull()
    expect(queue.value).toHaveLength(0)

    // per_login record should be cleared → can show again
    expect(canShow(loginTask, 'member123')).toBe(true)

    // Verify the per_login key is gone
    expect(localStorage.getItem('popup_per_login_member123')).toBeNull()

    // clearPerLoginRecord is also exported for direct use
    markAsShown(loginTask, 'member123')
    expect(canShow(loginTask, 'member123')).toBe(false)
    clearPerLoginRecord('member123')
    expect(canShow(loginTask, 'member123')).toBe(true)
  })
})
