import { stockHandlers } from './stock.js'
import { userHandlers } from './user.js'

export const handlers = [
  ...userHandlers,
  ...stockHandlers,
]