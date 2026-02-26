import { z } from 'zod'

/**
 * API 通用回應格式 Schema
 * 根據 Swagger 定義：code 是數字，msg 是訊息欄位
 */
export function apiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    code: z.number(),
    msg: z.string(),
    data: dataSchema,
  })
}

/**
 * 會員資料 Schema（根據 Swagger 定義）
 */
export const userInfoSchema = z.object({
  /** 會員編號（字串） */
  memberId: z.string(),
  /** 會員名字 */
  name: z.string(),
  /** 會員暱稱 */
  nickname: z.string(),
  /** 會員手機 */
  phone: z.string(),
  /** 會員信箱 */
  email: z.string().email(),
  /** 會員等級（數字，Swagger: number） */
  level: z.number(),
  /** 會員頭像編號（數字，Swagger: number） */
  avatarId: z.number(),
  /** 會員角色 */
  role: z.string(),
  /** 會員書籤收藏清單 */
  bookmarks: z.array(z.number()),
  /** 儲值金額 */
  balance: z.string(),
})

/**
 * GET /v1/api/user/info 回應格式
 * 包含 token 和 user 資料
 */
export const userInfoResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    token: z.string(),
    user: userInfoSchema,
  }),
})

/**
 * PUT /v1/api/user/info 回應格式
 * 根據 Swagger：直接返回更新後的完整 user 資料（與 GET 回應的 data.user 結構相同）
 */
export const updateUserInfoResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: userInfoSchema,
})

/**
 * Login 回應中的 User Schema
 * 根據 Swagger：POST /v1/api/user/login 回應的 data.user 欄位與 userInfoSchema 相同
 */
export const loginUserSchema = z.object({
  /** 會員編號（字串） */
  memberId: z.string(),
  /** 會員名字 */
  name: z.string(),
  /** 會員暱稱 */
  nickname: z.string(),
  /** 會員手機 */
  phone: z.string(),
  /** 會員信箱 */
  email: z.string().email(),
  /** 會員等級（數字，Swagger: number） */
  level: z.number(),
  /** 會員頭像編號（數字，Swagger: number） */
  avatarId: z.number(),
  /** 會員角色 */
  role: z.string(),
  /** 會員書籤收藏清單 */
  bookmarks: z.array(z.number()),
  /** 儲值金額 */
  balance: z.string(),
})

/**
 * POST /v1/api/user/login 回應格式
 */
export const loginResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    token: z.string(),
    user: loginUserSchema,
  }),
})

/**
 * TypeScript 類型推導
 */
export type UserInfo = z.infer<typeof userInfoSchema>
export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>
export type UpdateUserInfoResponse = z.infer<typeof updateUserInfoResponseSchema>
export type LoginUser = z.infer<typeof loginUserSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
