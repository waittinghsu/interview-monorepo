import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatNumber } from './format'

describe('format utils', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15 10:30:45')
      expect(formatDate(date, 'YYYY/MM/DD HH:mm')).toBe('2024/01/15 10:30')
    })
  })

  describe('formatNumber', () => {
    it('should format number with thousand separator', () => {
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(123)).toBe('123')
    })
  })

  describe('formatCurrency', () => {
    it('should format TWD currency', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1,000')
    })
  })
})
