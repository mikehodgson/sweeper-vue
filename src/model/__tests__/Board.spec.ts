import { describe, it, expect } from 'vitest'
import { type Board } from '../Board'
import { type Row } from '../Row'

describe('Board Interface', () => {
	it('should create a Board object with rows and active properties', () => {
		const rows: Row[] = [{ cells: [] }]
		const board: Board = { rows, active: true }

		expect(board).toHaveProperty('rows')
		expect(board).toHaveProperty('active')
		expect(board.rows).toBe(rows)
		expect(board.active).toBe(true)
	})

	it('should allow setting active to false', () => {
		const rows: Row[] = [{ cells: [] }]
		const board: Board = { rows, active: false }

		expect(board.active).toBe(false)
	})

	it('should allow an empty array of rows', () => {
		const board: Board = { rows: [], active: true }

		expect(board.rows).toEqual([])
	})
})
