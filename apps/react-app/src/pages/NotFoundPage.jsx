/**
 * NotFoundPage — 404 頁面
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<router-link to="/">回首頁</router-link>
 * React：<Link to="/">回首頁</Link>（react-router 的 Link 元件）
 *
 * 兩者都是客戶端導航（不重新載入頁面），
 * 差異在於 Vue 用 :to 物件或字串，React 用 to 字串 prop
 * ──────────────────────────────────────────────────────────────
 */

import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl font-bold m-0 mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
        404
      </p>
      <h1 className="text-lg font-bold m-0 mb-1" style={{ color: 'var(--text-base)' }}>找不到頁面</h1>
      <p className="text-sm m-0 mb-6" style={{ color: 'var(--text-muted)' }}>這個頁面不存在或已被移除</p>
      <Link
        to="/"
        className="text-sm font-medium px-5 py-2 rounded-full no-underline transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-primary)', color: 'white' }}
      >
        回首頁
      </Link>
    </div>
  )
}
export default NotFoundPage
