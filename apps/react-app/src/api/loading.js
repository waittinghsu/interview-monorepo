/**
 * Loading Bus（框架無關）
 *
 * 純 JS 的 loading 計數器，不依賴 React 或 Vue。
 * 透過 subscribe 讓 React hook 訂閱狀態變化。
 *
 * 設計原則：
 *   - HTTP 攔截器呼叫 push()/pop() 計數
 *   - React 層（useApiLoading）訂閱事件，提供 useState 驅動的 isLoading
 *   - 兩層解耦，這個模組可以在任何框架使用
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * 完全相同！此檔案從 vue-app 直接移植，無需修改。
 * Vue composable 和 React custom hook 都透過 subscribe 訂閱。
 * ──────────────────────────────────────────────────────────────
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
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get isLoading() { return pendingCount > 0 },
  get pendingCount() { return pendingCount },
}
