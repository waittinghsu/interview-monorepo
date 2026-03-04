export interface UserPayload {
  memberId: string
  email: string
  role: string
}

export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
