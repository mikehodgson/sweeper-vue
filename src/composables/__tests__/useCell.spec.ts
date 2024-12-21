import { describe, it, expect } from 'vitest'
import useCell from '../useCell'
import type { Cell } from '@/model/Cell'

describe('useCell', () => {
  const { createCell } = useCell()

  it('should create a cell with default values', () => {
    const params: Cell = {
      id: 1,
      isFlagged: false,
      isMine: false,
      visible: false,
      row: 1,
      column: 1,
    }
    const cell = createCell(params)
    expect(cell).toEqual({
      id: 1,
      isFlagged: false,
      isMine: false,
      visible: false,
      row: 1,
      column: 1,
    })
  })

  it('should override default values with provided params', () => {
    const params: Cell = { id: 2, isFlagged: true, isMine: true, visible: true, row: 1, column: 1 }
    const cell = createCell(params)
    expect(cell).toEqual({
      id: 2,
      isFlagged: true,
      isMine: true,
      visible: true,
      row: 1,
      column: 1,
    })
  })

  it('should create a cell with mixed default and provided values', () => {
    const params: Cell = { id: 3, isFlagged: true, row: 1, column: 1 }
    const cell = createCell(params)
    expect(cell).toEqual({
      id: 3,
      isFlagged: true,
      isMine: false,
      visible: false,
      row: 1,
      column: 1,
    })
  })
})
