import { z } from 'zod'

/**
 * API 通用回應格式 Schema
 */
export function apiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    code: z.number(),
    data: dataSchema,
    message: z.string().optional(),
  })
}

/**
 * 會員資料 Schema
 */
export const userInfoSchema = z.object({
  /** 會員編號 */
  memberId: z.number(),
  /** 會員名字 */
  name: z.string(),
  /** 會員暱稱 */
  nickname: z.string(),
  /** 會員手機 */
  phone: z.string(),
  /** 會員信箱 */
  email: z.string().email(),
  /** 儲值金額 */
  balance: z.string(),
  /** 會員等級 1~12 */
  level: z.number().min(1).max(12),
  /** 會員頭像編號 1~30 */
  avatarId: z.number().min(1).max(30),
  /** 會員書籤收藏清單 */
  bookmarks: z.array(z.number()),
})

/**
 * 會員資料 API 回應 Schema
 */
export const userInfoResponseSchema = apiResponseSchema(userInfoSchema)

/**
 * TypeScript 類型推導
 */
export type UserInfo = z.infer<typeof userInfoSchema>
export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>
