/**
 * MarqueeBanner — 公告跑馬燈
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：onMounted + setInterval，onUnmounted 清理
 * React：useEffect（同時處理 mount + unmount cleanup）
 *
 * Vue：const animationKey = ref(0)；:key="animationKey" 觸發重新動畫
 * React：const [animKey, setAnimKey] = useState(0)；key={animKey} 相同原理
 *   React 的 key 改變 = 強制卸載並重新掛載元件（重置動畫）
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ messages: string[] }} props
 */

import { useEffect, useState } from 'react'

const MARQUEE_STYLE = `
@keyframes marquee-slide {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
.marquee-animate {
  animation: marquee-slide 10s linear forwards;
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}
`

if (typeof document !== 'undefined' && !document.getElementById('marquee-style')) {
  const style = document.createElement('style')
  style.id = 'marquee-style'
  style.textContent = MARQUEE_STYLE
  document.head.appendChild(style)
}

function MarqueeBanner({ messages }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length)
      setAnimKey(prev => prev + 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div
      className="flex items-center py-2 overflow-hidden border-y"
      style={{ background: 'rgba(30,30,46,0.5)', borderColor: 'rgba(255,255,255,0.04)' }}
    >
      <svg className="ml-3 mr-2 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>

      <div className="flex-1 overflow-hidden mr-3">
        <span
          key={animKey}
          className="marquee-animate text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {messages[currentIndex]}
        </span>
      </div>
    </div>
  )
}

export default MarqueeBanner
