/**
 * CarouselBanner — 首頁輪播圖
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<q-carousel v-model="currentSlide" :autoplay="4000">
 * React：自製 carousel，用 useState + useEffect 模擬 autoplay
 *
 * Vue ref 綁定：v-model="currentSlide"（雙向）
 * React state：const [current, setCurrent] = useState(0)（單向 + handler）
 *
 * 動畫：Framer Motion 的 AnimatePresence + motion.div
 *   AnimatePresence：讓「離開」的元素可以播放 exit 動畫（React 沒有 v-show 等效）
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ slides: Array<{ id, image, title, subtitle, colorFrom, colorTo }> }} props
 */

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function CarouselBanner({ slides }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative h-[200px] overflow-hidden">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slide.image
            ? (
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              )
            : (
                <div
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${slide.colorFrom || '#1e1b4b'}, ${slide.colorTo || '#312e81'})` }}
                />
              )}

          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white font-bold text-lg m-0 leading-tight drop-shadow"
               style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {slide.title}
            </p>
            {slide.subtitle && (
              <p className="text-white/70 text-xs m-0 mt-0.5">{slide.subtitle}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <div className="absolute bottom-2 right-3 flex gap-1 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{ background: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselBanner
