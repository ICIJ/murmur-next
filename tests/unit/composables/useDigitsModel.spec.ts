import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import {
  keepDigitsOnly,
  spreadDigits,
  useDigitsModel
} from '@/composables/useDigitsModel'
import type { UseDigitsModel } from '@/composables/useDigitsModel'

// Mounts a host component so the composable's normalization `watch` runs inside
// a real setup scope (a watcher needs an active component instance).
function mountWithDigitsModel(modelValue: string | number = '', length = 4) {
  const modelValueRef = ref(modelValue)
  const lengthRef = ref(length)
  const onNormalized = vi.fn()
  let api!: UseDigitsModel

  const host = defineComponent({
    setup() {
      api = useDigitsModel(
        { modelValue: modelValueRef, length: lengthRef },
        onNormalized
      )
      return () => h('div')
    }
  })

  const wrapper = mount(host)
  return { wrapper, api, modelValueRef, lengthRef, onNormalized }
}

describe('useDigitsModel', () => {
  it('seeds `values` from the initial modelValue, truncated to length', () => {
    const { api } = mountWithDigitsModel('204815', 4)
    expect(api.values.value).toEqual(['2', '0', '4', '8'])
  })

  it('spreads a multi-digit cell across cells and fires onNormalized', async () => {
    const { api, onNormalized } = mountWithDigitsModel('', 4)
    onNormalized.mockClear()

    api.values.value[0] = '2048'
    await nextTick()

    expect(api.values.value).toEqual(['2', '0', '4', '8'])
    expect(onNormalized).toHaveBeenCalled()
  })

  it('reflects the joined digits in `joinedValues`, filtering empty cells', async () => {
    const { api } = mountWithDigitsModel('', 4)

    api.values.value[0] = '2048'
    await nextTick()

    expect(api.joinedValues.value).toBe('2048')
  })

  it('does not fire onNormalized when an unchanged cell is reassigned', async () => {
    const { api, onNormalized } = mountWithDigitsModel('2048', 4)
    onNormalized.mockClear()

    // Reassigning the same single digit leaves the normalized result unchanged,
    // so the guard skips the rewrite — but the watcher itself does not re-fire
    // because the deep value did not actually change.
    api.values.value[0] = '2'
    await nextTick()

    expect(onNormalized).not.toHaveBeenCalled()
  })
})

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
