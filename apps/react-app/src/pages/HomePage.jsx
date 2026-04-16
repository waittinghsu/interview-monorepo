/**
 * HomePage — 首頁
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：const router = useRouter()；router.push({ name: 'Group', params: { id } })
 * React：const navigate = useNavigate()；navigate(`/group/${id}`)
 *
 * Vue：const selectedCompanyId = ref(companies[0].id)
 * React：const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id)
 *
 * Vue：const displayedGroups = computed(() => getGroupsByCompany(selectedCompanyId.value))
 * React：const displayedGroups = useMemo(() => getGroupsByCompany(selectedCompanyId), [selectedCompanyId])
 *
 * 重要差異：
 *   Vue computed 是「懶惰求值 + 自動追蹤依賴」
 *   React useMemo 需要「手動宣告 dependencies」（ESLint exhaustive-deps 會提醒）
 * ──────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import CarouselBanner from '@/components/home/CarouselBanner'
import CompanySlider from '@/components/home/CompanySlider'
import GroupCard from '@/components/group/GroupCard'
import MarqueeBanner from '@/components/home/MarqueeBanner'
import { companies, getGroupsByCompany } from '@/data/kpop'

const carouselSlides = [
  { id: 1, image: '/images/home/carousel/26_twice.jpg', title: 'TWICE', subtitle: 'JYP Entertainment', colorFrom: '#ff6b9d', colorTo: '#ff8e53' },
  { id: 2, image: '/images/home/carousel/26_day6.jpg', title: 'Day6', subtitle: 'JYP Entertainment', colorFrom: '#f59e0b', colorTo: '#10b981' },
  { id: 3, image: '/images/home/carousel/26_jm2026.jpg', title: 'K-Pop Hub', subtitle: '探索你喜愛的 K-pop 團體', colorFrom: '#7c3aed', colorTo: '#2563eb' },
  { id: 4, image: '', title: 'BTS', subtitle: 'HYBE Labels', colorFrom: '#4f46e5', colorTo: '#7c3aed' },
  { id: 5, image: '', title: 'BLACKPINK', subtitle: 'YG Entertainment', colorFrom: '#ec4899', colorTo: '#374151' },
]

const marqueeMessages = [
  '歡迎來到 K-Pop Hub！探索你最愛的韓流偶像 ✨',
  'TWICE 出道 10 週年，粉絲見面會全球巡迴中 🎉',
  'NewJeans 新單曲登上 Billboard Global 排行榜 🏆',
  'aespa 世界巡迴演唱會亞洲場開票中，趕快搶票！',
  'Stray Kids 連續登頂 Billboard 200 冠軍 🔥',
  'BTS 全員退伍！2025 完整體回歸！ARMY 期待已久 💜',
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function HomePage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id)
  const navigate = useNavigate()

  const displayedGroups = useMemo(
    () => getGroupsByCompany(selectedCompanyId),
    [selectedCompanyId],
  )

  return (
    <div className="flex flex-col -mx-4 -mt-4">
      <section>
        <CarouselBanner slides={carouselSlides} />
      </section>

      <section>
        <MarqueeBanner messages={marqueeMessages} />
      </section>

      <section>
        <div className="px-4 pt-4 pb-0">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest m-0"
              style={{ color: 'var(--text-muted)' }}>
            娛樂公司
          </h2>
        </div>
        <CompanySlider
          companies={companies}
          activeId={selectedCompanyId}
          onSelect={setSelectedCompanyId}
        />
      </section>

      <section className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold m-0" style={{ color: 'var(--text-base)' }}>
            旗下團體
          </h2>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {displayedGroups.length}
          </span>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={selectedCompanyId}
        >
          {displayedGroups.map(group => (
            <motion.div key={group.id} variants={cardVariants}>
              <GroupCard
                group={group}
                onClick={(id) => navigate(`/group/${id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage
