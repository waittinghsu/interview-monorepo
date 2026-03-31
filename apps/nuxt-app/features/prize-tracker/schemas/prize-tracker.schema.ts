import { z } from 'zod'

export const prizeStateSchema = z.object({
  pageId: z.string(),
  name: z.string(),
  remaining: z.number(),
  total: z.number(),
})

export const drawEventSchema = z.object({
  name: z.string(),
  drawnCount: z.number(),
  beforeRemaining: z.number(),
  afterRemaining: z.number(),
  detectedAt: z.string(),
})

export const prizeStateListSchema = z.array(prizeStateSchema)
export const drawEventListSchema = z.array(drawEventSchema)

export type PrizeState = z.infer<typeof prizeStateSchema>
export type DrawEvent = z.infer<typeof drawEventSchema>
