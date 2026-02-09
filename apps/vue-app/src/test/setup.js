import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/mocks/server'

// 測試前啟動 MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 每個測試後重置 handlers
afterEach(() => server.resetHandlers())

// 測試後關閉 server
afterAll(() => server.close())
