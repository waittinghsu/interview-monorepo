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
