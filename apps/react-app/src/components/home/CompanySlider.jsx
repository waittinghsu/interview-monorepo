/**
 * CompanySlider — 娛樂公司水平選擇器
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：emit('select', company.id) → 父層 @select="onCompanySelect"
 * React：callback prop onSelect(id) → 父層傳入函數
 *
 * Vue：:class="activeId === company.id ? 'border-primary' : ''"
 * React：style={{ borderColor: isActive ? 'var(--color-primary)' : ... }}
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ companies: Array, activeId: string, onSelect: (id: string) => void }} props
 */

import { motion } from 'framer-motion'

function CompanySlider({ companies, activeId, onSelect }) {
  return (
    <div className="py-3">
      <div className="flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {companies.map((company) => {
          const isActive = activeId === company.id
          return (
            <motion.button
              key={company.id}
              onClick={() => onSelect(company.id)}
              className="flex flex-col items-center flex-shrink-0 min-w-[64px] cursor-pointer bg-transparent border-none p-0 outline-none"
              whileTap={{ scale: 0.92 }}
              animate={{ opacity: activeId && !isActive ? 0.4 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-colors duration-200"
                animate={{
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--border)',
                  scale: isActive ? 1.05 : 1,
                }}
                style={isActive ? { boxShadow: `0 0 16px ${company.color}55` } : {}}
              >
                {company.icon
                  ? (
                      <img src={company.icon} alt={company.name} className="w-full h-full object-contain" />
                    )
                  : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, ${company.gradientFrom}, ${company.gradientTo})`, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
                      >
                        {company.shortName.slice(0, 2)}
                      </div>
                    )}
              </motion.div>
              <span className="text-[11px] mt-1.5 text-center leading-tight font-medium" style={{ color: 'var(--text-secondary)' }}>
                {company.shortName}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default CompanySlider
