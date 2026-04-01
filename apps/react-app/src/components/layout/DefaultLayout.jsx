// Placeholder — 將在 Task 5 完整實作
import { Outlet } from 'react-router'

function DefaultLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  )
}
export default DefaultLayout
