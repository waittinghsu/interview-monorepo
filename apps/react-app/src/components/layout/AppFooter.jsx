/**
 * AppFooter — 底部列
 */

function AppFooter() {
  return (
    <footer
      className="border-t py-3"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <p className="text-center text-xs m-0" style={{ color: 'var(--text-muted)' }}>
        K-Pop Hub — 探索你喜愛的 K-pop 團體
      </p>
    </footer>
  )
}

export default AppFooter
