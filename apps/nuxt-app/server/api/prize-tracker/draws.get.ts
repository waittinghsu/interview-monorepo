import process from 'node:process'

const BASE_URL = process.env.PRIZE_TRACKER_API_URL || 'https://twice-prize-tracker.zeabur.app'

export default defineEventHandler(async () => {
  return $fetch(`${BASE_URL}/api/draws`)
})
