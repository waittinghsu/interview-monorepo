/**
 * AppHeader — 頂部導覽列
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<router-link :to="{ name: 'Home' }">
 * React：<Link to="/">（react-router 的 Link 元件）
 *
 * Vue：const isHome = computed(() => route.name === 'Home')
 * React：const location = useLocation()
 *        const isHome = location.pathname === '/'
 *
 * Vue：router.back()
 * React：navigate(-1)（useNavigate hook 返回的函數）
 * ──────────────────────────────────────────────────────────────
 */

import { Link, useLocation, useNavigate } from 'react-router'

function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  // 判斷是否在首頁（= Vue 的 route.name === 'Home'）
  const isHome = location.pathname === '/'

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(22, 22, 31, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center min-h-[52px] px-3 max-w-[480px] mx-auto">
        {/* 返回按鈕（非首頁才顯示）— Vue 對應：v-if="!isHome" */}
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="mr-2 p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="返回"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18V5l12-2v13" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" fill="var(--color-primary)"/>
            <circle cx="18" cy="16" r="3" fill="var(--color-primary)" opacity="0.6"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text-base)', letterSpacing: '0.05em', fontSize: '1.1rem' }}>
            K-POP
          </span>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
            HUB
          </span>
        </Link>

        <div className="flex-1" />

        <button
          className="p-1.5 rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="搜尋"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
