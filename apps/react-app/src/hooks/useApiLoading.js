/**
 * useApiLoading — 追蹤全域 HTTP loading 狀態
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：composable（useApiLoading.js）用 ref + onMounted + onUnmounted
 * React：custom hook 用 useState + useEffect
 *
 * 命名慣例：
 *   Vue composable：useXxx（返回 reactive refs）
 *   React custom hook：useXxx（返回普通值，state 變化觸發 re-render）
 *
 * 訂閱模式（兩者相同）：
 *   1. 元件 mount → subscribe
 *   2. loadingBus 通知 → 更新 state
 *   3. 元件 unmount → unsubscribe（cleanup）
 * ──────────────────────────────────────────────────────────────
 *
 * @returns {{ isLoading: boolean, pendingCount: number }}
 */

import { useEffect, useState } from 'react'
import { loadingBus } from '@/api/loading'

export function useApiLoading() {
  // useState：宣告本地狀態，[值, 更新函數]
  // Vue 對應：const isLoading = ref(loadingBus.isLoading)
  const [isLoading, setIsLoading] = useState(loadingBus.isLoading)
  const [pendingCount, setPendingCount] = useState(loadingBus.pendingCount)

  useEffect(() => {
    // ── mount：訂閱 loadingBus ──
    // Vue 對應：onMounted(() => { unsubscribe = loadingBus.subscribe(...) })
    const unsubscribe = loadingBus.subscribe((loading, count) => {
      setIsLoading(loading)
      setPendingCount(count)
    })

    // ── cleanup（unmount）：取消訂閱 ──
    // Vue 對應：onUnmounted(() => { unsubscribe?.() })
    // React useEffect：return 一個函數 = cleanup（元件銷毀時執行）
    return unsubscribe
  }, []) // [] = 只在 mount/unmount 時執行

  return { isLoading, pendingCount }
}
