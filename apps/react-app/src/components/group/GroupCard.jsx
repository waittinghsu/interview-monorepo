/**
 * GroupCard — 團體卡片
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：emit('click', group.id) → 父層 @click="goToGroup"
 * React：onClick prop → 父層傳 (id) => navigate(`/group/${id}`)
 *
 * Vue：:style="{ background: `${group.color}22` }"（模板字串）
 * React：style={{ background: `${group.color}22` }}（JSX 雙括號）
 *
 * Framer Motion whileHover/whileTap 替代 Vue 的 active:scale-95
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ group: object, onClick: (id: string) => void }} props
 */

import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

function GroupCard({ group, onClick }) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.4)',
      }}
      onClick={() => onClick(group.id)}
      whileHover={{ scale: 1.02, borderColor: `${group.color}44` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-[110px] overflow-hidden">
        {group.cover
          ? (
              <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
            )
          : (
              <div
                className="w-full h-full"
                style={{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }}
              />
            )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />

        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white font-bold text-sm m-0 leading-tight truncate"
             style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
            {group.name}
          </p>
          <p className="text-white/60 text-[10px] m-0">{group.koreanName}</p>
        </div>
      </div>

      <div className="px-3 py-2 flex items-center justify-between">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${group.color}22`, color: group.color }}
        >
          {group.fandomName}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </motion.div>
  )
}

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string,
    color: PropTypes.string,
    cover: PropTypes.string,
    name: PropTypes.string,
    koreanName: PropTypes.string,
    fandomName: PropTypes.string,
    gradientFrom: PropTypes.string,
    gradientTo: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default GroupCard
