import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBoardStore } from '../useBoardStore'
import type { Cell } from '@/model/Cell'

describe('useBoardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('initializes the board correctly', () => {
		const store = useBoardStore()
		store.createBoard()
		expect(store.currentBoard.rows.length).toBe(16)
		expect(store.currentBoard.rows[0].cells.length).toBe(16)
	})

	it('adds the correct number of mines', () => {
		const store = useBoardStore()
		store.createBoard()
		const mineCount = store.currentBoard.rows
			.flatMap((row) => row.cells)
			.filter((cell) => cell.isMine).length
		expect(mineCount).toBe(40)
	})

	it('calculates nearby mines correctly', () => {
		const store = useBoardStore()
		store.createBoard()
		const cell: Cell = store.currentBoard.rows[0].cells[0]
		cell.isMine = true
		const nearbyMines = store.nearbyMineCount(store.currentBoard.rows[0].cells[1])
		expect(nearbyMines).toBeGreaterThanOrEqual(1)
	})

	it('clears nearby cells correctly', () => {
		const store = useBoardStore()
		store.createBoard()
		const cell: Cell = store.currentBoard.rows[0].cells[0]
		cell.isMine = false
		store.clearNearbyCells(cell)
		expect(cell.visible).toBe(true)
	})

	it('resets the board correctly', () => {
		const store = useBoardStore()
		store.createBoard()
		store.resetBoard()
		expect(store.currentBoard.rows.length).toBe(16)
		expect(store.currentBoard.rows[0].cells.length).toBe(16)
	})

	it('computes board size correctly', () => {
		const store = useBoardStore()
		expect(store.boardSize).toBe(256)
	})
})
