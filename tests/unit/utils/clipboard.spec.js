import noop from 'lodash/noop'
import { copyText } from '@/utils/clipboard'

describe('clipboard.js', () => {
  it('should return a Promise', () => {
    const promise = copyText('uwu').catch(noop)
    expect(promise).toBeInstanceOf(Promise)
  })

  it('should reject the promise', async () => {
    try {
      await copyText('uwu')
    }
    catch (error) {
      expect(error.text).toBe('uwu')
    }
  })
})
