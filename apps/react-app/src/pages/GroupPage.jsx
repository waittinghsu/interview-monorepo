/**
 * GroupPage — 團體詳情頁
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：const route = useRoute()；route.params.id
 * React：const { id } = useParams()（直接解構）
 *
 * Vue：watchEffect(() => { if (!group.value) router.replace({ name: 'Home' }) })
 * React：useEffect(() => { if (!group) navigate('/', { replace: true }) }, [group, navigate])
 *
 * Vue：v-if="group"（條件渲染）
 * React：if (!group) return null（早期返回，更直觀）
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import MemberCard from '@/components/member/MemberCard'
import { getCompanyById, getGroupById, getMembersByGroup } from '@/data/kpop'

function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const group = useMemo(() => getGroupById(id), [id])
  const company = useMemo(() => group ? getCompanyById(group.companyId) : null, [group])
  const members = useMemo(() => group ? getMembersByGroup(group.id) : [], [group])

  useEffect(() => {
    if (group === undefined) {
      navigate('/', { replace: true })
    }
  }, [group, navigate])

  if (!group) return null

  const gridCols = members.length <= 4 ? 'grid-cols-4' : members.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <motion.div
      className="flex justify-center min-h-full -mx-4 -mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-[480px] pb-6">
        <div className="relative h-[220px] overflow-hidden">
          {group.cover
            ? <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
            : (
                <div className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }}
                />
              )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2) 50%, transparent)' }} />

          <div className="absolute bottom-4 left-4 right-4">
            {company && <p className="text-white/60 text-xs m-0 mb-0.5">{company.name}</p>}
            <h1 className="text-white text-2xl font-bold m-0 leading-tight"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {group.name}
            </h1>
            <p className="text-white/70 text-sm m-0 mt-0.5">{group.koreanName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: `${group.color}22`, color: group.color }}>
            ♡ {group.fandomName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
            📅 出道 {group.debut}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
            👥 {members.length} 位成員
          </span>
        </div>

        <div className="px-4 pt-3 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
            {group.description}
          </p>
        </div>

        <div className="px-4 pt-4">
          <h2 className="text-sm font-bold mb-4 m-0" style={{ color: 'var(--text-base)' }}>成員</h2>
          <div className={`grid gap-4 ${gridCols}`}>
            {members.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                clickable
                onClick={(memberId) => navigate(`/member/${memberId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GroupPage
