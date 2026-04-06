/**
 * MemberPage — 成員詳情頁
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：const member = computed(() => getMemberById(route.params.id))
 * React：const { id } = useParams()；const member = useMemo(() => getMemberById(id), [id])
 *
 * Vue：group?.name（optional chaining 在 template 中）
 * React：{group?.name}（JSX 中相同語法，JS 表達式）
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { getGroupById, getMemberById } from '@/data/kpop'

function MemberPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const member = useMemo(() => getMemberById(id), [id])
  const group = useMemo(() => member ? getGroupById(member.groupId) : null, [member])

  useEffect(() => {
    if (member === undefined) navigate('/', { replace: true })
  }, [member, navigate])

  if (!member) return null

  return (
    <motion.div
      className="flex justify-center min-h-full -mx-4 -mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-[480px] pb-8">
        <div className="relative h-[300px] overflow-hidden">
          {member.photo
            ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
            : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}66, ${member.color || '#374151'}22 70%), linear-gradient(180deg, transparent 40%, black)` }}
                >
                  <span className="text-white/20 font-bold select-none" style={{ fontSize: '8rem', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2) 60%, transparent)' }} />

          <button
            className="absolute top-4 left-4 flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
            onClick={() => group && navigate(`/group/${group.id}`)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{group?.name}</span>
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white text-2xl font-bold m-0 leading-tight"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {member.name}
            </h1>
            <p className="text-white/70 text-sm m-0 mt-0.5">
              {member.koreanName} · {member.englishName}
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4 rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>生日</p>
              <p className="text-sm font-medium m-0" style={{ color: 'var(--text-base)' }}>{member.birthday}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>國籍</p>
              <p className="text-sm font-medium m-0" style={{ color: 'var(--text-base)' }}>{member.nationality}</p>
            </div>
            {group && (
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>所屬團體</p>
                <button
                  className="text-sm font-medium bg-transparent border-none cursor-pointer p-0 flex items-center gap-1"
                  style={{ color: group.color }}
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  {group.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mt-4">
          <h2 className="text-sm font-bold mb-3 m-0" style={{ color: 'var(--text-base)' }}>擔當</h2>
          <div className="flex flex-wrap gap-2">
            {member.position?.map(pos => (
              <span
                key={pos}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: `${member.color || '#374151'}22`, color: member.color || 'var(--text-muted)' }}
              >
                {pos}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MemberPage
