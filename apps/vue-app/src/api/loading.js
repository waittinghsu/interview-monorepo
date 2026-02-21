/**
 * Loading Bus
 *
 * 純 JS 的 loading 計數器，不依賴 Vue reactivity。
 * 透過 subscribe 讓 Vue composable 訂閱狀態變化。
 *
 * 設計原則：
 *   - shared-api（攔截器）呼叫 onRequestStart/onRequestEnd，這裡計數
 *   - Vue 層（useApiLoading）訂閱這裡的事件，提供 reactive isLoading
 *   - 兩層解耦，shared-api 保持 framework-agnostic
 *
 * 使用：
 *   import { loadingBus } from '@/api/loading'
 *   loadingBus.push()         // 請求開始
 *   loadingBus.pop()          // 請求結束
 *   loadingBus.subscribe(fn)  // fn(isLoading: boolean, count: number) => void
 *                             // 回傳 unsubscribe 函數
 */

let pendingCount = 0
const listeners = new Set()

function notify() {
  const isLoading = pendingCount > 0
  listeners.forEach(fn => fn(isLoading, pendingCount))
}

export const loadingBus = {
  push() {
    pendingCount++
    notify()
  },

  pop() {
    pendingCount = Math.max(0, pendingCount - 1)
    notify()
  },

  /**
   * 訂閱 loading 狀態變化
   * @param {Function} fn - (isLoading: boolean, count: number) => void
   * @returns {Function} unsubscribe
   */
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  get isLoading() {
    return pendingCount > 0
  },

  get pendingCount() {
    return pendingCount
  },
}
