import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { usePagination } from '@/composables/usePagination'

describe('usePagination', () => {
  it('derives the number of pages from totalRows and perPage', () => {
    const { numberOfPages } = usePagination({
      currentPage: 1,
      totalRows: 200,
      perPage: 20
    })
    expect(numberOfPages.value).toBe(10)
  })

  it('rounds the page count up for a partial last page', () => {
    const { numberOfPages } = usePagination({
      currentPage: 1,
      totalRows: 195,
      perPage: 20
    })
    expect(numberOfPages.value).toBe(10)
  })

  it('honors an explicit pages input over the derived count', () => {
    const { numberOfPages } = usePagination({
      currentPage: 1,
      totalRows: 200,
      perPage: 20,
      pages: 3
    })
    expect(numberOfPages.value).toBe(3)
  })

  it('coerces a numeric-string current page', () => {
    const { pageValue } = usePagination({
      currentPage: '4',
      totalRows: 200,
      perPage: 20
    })
    expect(pageValue.value).toBe(4)
  })

  it('computes the last row of the current page range', () => {
    const { lastRangeRow } = usePagination({
      currentPage: 3,
      totalRows: 200,
      perPage: 20
    })
    expect(lastRangeRow.value).toBe(60)
  })

  describe('navigation bound flags', () => {
    it('disables the backward bounds on the first page', () => {
      const { hasFirst, hasPrevious, hasLast, hasNext } = usePagination({
        currentPage: 1,
        totalRows: 200,
        perPage: 20
      })
      expect(hasFirst.value).toBe(false)
      expect(hasPrevious.value).toBe(false)
      expect(hasLast.value).toBe(true)
      expect(hasNext.value).toBe(true)
    })

    it('disables the forward bounds on the last page', () => {
      const { hasFirst, hasPrevious, hasLast, hasNext } = usePagination({
        currentPage: 10,
        totalRows: 200,
        perPage: 20
      })
      expect(hasFirst.value).toBe(true)
      expect(hasPrevious.value).toBe(true)
      expect(hasLast.value).toBe(false)
      expect(hasNext.value).toBe(false)
    })

    it('disables every bound when there is a single page', () => {
      const { hasFirst, hasPrevious, hasLast, hasNext } = usePagination({
        currentPage: 1,
        totalRows: 5,
        perPage: 20
      })
      expect(hasFirst.value).toBe(false)
      expect(hasPrevious.value).toBe(false)
      expect(hasLast.value).toBe(false)
      expect(hasNext.value).toBe(false)
    })
  })

  describe('clampPage', () => {
    it('clamps a page below the lower bound up to the first page', () => {
      const { clampPage } = usePagination({
        currentPage: 1,
        totalRows: 200,
        perPage: 20
      })
      expect(clampPage(0)).toBe(1)
      expect(clampPage(-5)).toBe(1)
    })

    it('clamps a page above the upper bound down to the last page', () => {
      const { clampPage } = usePagination({
        currentPage: 1,
        totalRows: 200,
        perPage: 20
      })
      expect(clampPage(999)).toBe(10)
    })

    it('floors a fractional page within range', () => {
      const { clampPage } = usePagination({
        currentPage: 1,
        totalRows: 200,
        perPage: 20
      })
      expect(clampPage(3.9)).toBe(3)
    })
  })

  it('recomputes derived values when reactive inputs change', () => {
    const currentPage = ref(1)
    const totalRows = ref(200)
    const { numberOfPages, hasPrevious } = usePagination({
      currentPage,
      totalRows,
      perPage: 20
    })

    expect(numberOfPages.value).toBe(10)
    expect(hasPrevious.value).toBe(false)

    currentPage.value = 5
    totalRows.value = 100
    expect(numberOfPages.value).toBe(5)
    expect(hasPrevious.value).toBe(true)
  })
})
