import type { ApiResponse, UserInfo } from '~/types/api'

/**
 * Mock 會員資料 API
 * GET /api/userinfo
 */
export default defineEventHandler((): ApiResponse<UserInfo> => {
  // 模擬會員資料
  const mockUserInfo: UserInfo = {
    memberId: 1001,
    name: '王小明',
    nickname: '小明',
    phone: '0912345678',
    email: 'xiaoming@example.com',
    balance: '12580.00',
    level: 8,
    avatarId: 15,
    bookmarks: [1, 5, 12, 28, 35, 67, 89],
  }

  return {
    code: 200,
    data: mockUserInfo,
  }
})
