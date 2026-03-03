/**
 * API 通用回應格式
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message?: string
}

/**
 * 會員資料
 */
export interface UserInfo {
  /** 會員編號 */
  memberId: number
  /** 會員名字 */
  name: string
  /** 會員暱稱 */
  nickname: string
  /** 會員手機 */
  phone: string
  /** 會員信箱 */
  email: string
  /** 儲值金額 */
  balance: string
  /** 會員等級 1~12 */
  level: number
  /** 會員頭像編號 1~30 */
  avatarId: number
  /** 會員書籤收藏清單 */
  bookmarks: number[]
}
