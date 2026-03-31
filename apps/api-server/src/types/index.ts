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

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface VenueData {
  name: string
  address: string
  city: string
  capacity: number
}

export interface TicketData {
  type: string
  name: string
  price: string
  quantity: number
  available: number
}
