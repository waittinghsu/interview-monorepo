export interface PrizeState {
  pageId: string
  name: string
  remaining: number
  total: number
}

export interface DrawEvent {
  name: string
  drawnCount: number
  beforeRemaining: number
  afterRemaining: number
  detectedAt: string
}
