export type DisplayRule =
  | 'unlimited'
  | 'once_ever'
  | 'once_daily'
  | 'once_weekly'
  | 'once_per_login'

export type PopupComponentName =
  | 'PopupTextAnnouncement'
  | 'PopupImageButton'
  | 'PopupRoulette'
  | 'PopupTicTacToe'
  | 'PopupCyber'
  | 'PopupFormInput'
  | 'PopupImageDisintegrate'

export interface PopupRecord {
  shownAt: string
  shownCount: number
}

export type UserPopupState = Record<string, PopupRecord>

export interface PopupTask {
  key: string
  name: string
  priority: number
  displayRule: DisplayRule
  component: PopupComponentName
  extra: Record<string, unknown>
}
