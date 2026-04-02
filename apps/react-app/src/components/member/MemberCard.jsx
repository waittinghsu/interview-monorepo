/**
 * MemberCard — 成員頭像卡片
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：defineProps({ member, clickable })；clickable && emit('click', member.id)
 * React：function MemberCard({ member, clickable = false, onClick })
 *        直接呼叫 onClick(member.id)，無 emit 系統
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ member: object, clickable?: boolean, onClick?: (id: string) => void }} props
 */

import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

function MemberCard({ member, clickable = false, onClick }) {
  const handleClick = () => {
    if (clickable && onClick) onClick(member.id)
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      onClick={handleClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
      whileTap={clickable ? { scale: 0.92 } : {}}
    >
      <div
        className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
        style={{
          borderColor: member.color || 'var(--border)',
          boxShadow: member.color ? `0 0 12px ${member.color}44` : 'none',
        }}
      >
        {member.photo
          ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
            )
          : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-lg select-none"
                style={{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}aa, ${member.color || '#374151'}44)` }}
              >
                {member.name.charAt(0)}
              </div>
            )}
      </div>

      <span className="text-xs text-center leading-tight font-medium mt-0.5 w-full truncate px-1"
            style={{ color: 'var(--text-base)' }}>
        {member.name}
      </span>
      <span className="text-[10px] text-center leading-tight"
            style={{ color: 'var(--text-muted)' }}>
        {member.koreanName}
      </span>
    </motion.div>
  )
}

MemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    koreanName: PropTypes.string,
    photo: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
}

export default MemberCard
