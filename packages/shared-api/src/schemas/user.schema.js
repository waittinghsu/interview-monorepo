import { z } from 'zod'

/**
 * 用戶 Schema
 */
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user']).optional(),
})

/**
 * 登入請求 Schema
 */
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

/**
 * 登入回應 Schema
 */
export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
})

/**
 * 註冊請求 Schema
 */
export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

// Type exports
export const User = userSchema
export const LoginRequest = loginRequestSchema
export const LoginResponse = loginResponseSchema
export const RegisterRequest = registerRequestSchema