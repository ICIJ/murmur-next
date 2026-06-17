import { keepDigitsOnly, spreadDigits } from '@/composables/useDigitsModel'

describe('useDigitsModel helpers', () => {
  describe('keepDigitsOnly', () => {
    it('strips non-digit characters', () => {
      expect(keepDigitsOnly('2 0 4 8')).toBe('2048')
      expect(keepDigitsOnly('2-0-4-8')).toBe('2048')
      expect(keepDigitsOnly('foo')).toBe('')
    })
  })

  describe('spreadDigits', () => {
    it('leaves single-digit cells untouched', () => {
      expect(spreadDigits(['2', '0', '4', '8'], 4)).toEqual(['2', '0', '4', '8'])
    })

    it('spreads a multi-digit first cell across the following cells', () => {
      expect(spreadDigits(['2048', '', '', ''], 4)).toEqual(['2', '0', '4', '8'])
    })

    it('truncates the result to the given length', () => {
      expect(spreadDigits(['20489', '', '', ''], 4)).toEqual(['2', '0', '4', '8'])
    })

    it('ignores non-digit characters before spreading', () => {
      expect(spreadDigits(['2-0-4-8', '', '', ''], 4)).toEqual(['2', '0', '4', '8'])
      expect(spreadDigits([' 204 8 ', '', '', ''], 4)).toEqual(['2', '0', '4', '8'])
    })

    it('spreads from a later cell', () => {
      expect(spreadDigits(['', '204', '', ''], 4)).toEqual(['', '2', '0', '4'])
    })
  })
})
