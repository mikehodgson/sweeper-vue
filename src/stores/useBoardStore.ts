import type { Board } from '@/model/Board'
import type { Cell } from '@/model/Cell'
import useCell from '@/composables/useCell'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
	// Configuration
	const config = {
		rows: 16,
		columns: 16,
		mines: 40,
	}

	// State
	const currentBoard: Ref<Board> = ref({ rows: [], active: true } as Board)
	const gameStatus = ref<'not-started' | 'playing' | 'won' | 'lost'>('not-started')

	// Composables
	const { createCell } = useCell()

	// Computed properties
	const boardSize = computed(() => config.rows * config.columns)

	const isWinner = computed(() => {
		if (!currentBoard.value.active) return false
		const cells = currentBoard.value.rows.flatMap((row) => row.cells)
		return cells.every((cell) => (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.visible))
	})

	const visibleCellsCount = computed(() => {
		return currentBoard.value.rows.flatMap((row) => row.cells).filter((cell) => cell.visible).length
	})

	// Board creation
	const createBoard = (): void => {
		let count = 0
		currentBoard.value = { rows: [], active: true }

		// Create cells
		for (let r = 0; r < config.rows; r++) {
			currentBoard.value.rows[r] = { cells: [] }
			for (let c = 0; c < config.columns; c++) {
				count++
				currentBoard.value.rows[r].cells.push(createCell({ id: count, row: r, column: c }))
			}
		}

		addMines()
		gameStatus.value = 'playing'
	}

	const addMines = (): void => {
		const usedIndexes = new Set<string>()

		while (usedIndexes.size < config.mines) {
			const row = Math.floor(Math.random() * config.rows)
			const column = Math.floor(Math.random() * config.columns)
			const key = `${row},${column}`

			if (!usedIndexes.has(key)) {
				usedIndexes.add(key)
				currentBoard.value.rows[row].cells[column].isMine = true
			}
		}
	}

	// Cell operations
	const getNearbyCells = (location: Cell): Cell[] => {
		const directions = [
			{ row: 0, column: -1 },
			{ row: 0, column: 1 },
			{ row: -1, column: 0 },
			{ row: 1, column: 0 },
			{ row: -1, column: 1 },
			{ row: 1, column: -1 },
			{ row: -1, column: -1 },
			{ row: 1, column: 1 },
		]

		return directions
			.map((dir) => {
				const newRow = location.row + dir.row
				const newColumn = location.column + dir.column
				return currentBoard.value.rows[newRow]?.cells[newColumn]
			})
			.filter((cell): cell is Cell => cell !== undefined)
	}

	const nearbyMineCount = (location: Cell): number => {
		return getNearbyCells(location).filter((cell) => cell.isMine).length
	}

	const clearNearbyCells = (cell: Cell): void => {
		if (cell.isMine || cell.visible) return

		cell.visible = true

		if (nearbyMineCount(cell) !== 0) return

		getNearbyCells(cell)
			.filter((nearbyCell) => !nearbyCell.isMine && !nearbyCell.visible)
			.forEach(clearNearbyCells)
	}

	const moveMine = (cell: Cell): void => {
		cell.isMine = false
		let row: number, column: number

		do {
			row = Math.floor(Math.random() * config.rows)
			column = Math.floor(Math.random() * config.columns)
		} while (currentBoard.value.rows[row].cells[column].isMine)

		currentBoard.value.rows[row].cells[column].isMine = true
	}

	const toggleFlag = (cell: Cell): void => {
		if (!cell.visible) {
			cell.isFlagged = !cell.isFlagged
		}
	}

	const checkGameStatus = (): void => {
		if (isWinner.value) {
			gameStatus.value = 'won'
			currentBoard.value.active = false
		}
	}

	const endGame = (): void => {
		gameStatus.value = 'lost'
		currentBoard.value.active = false

		// Reveal all mines
		currentBoard.value.rows.forEach((row) => {
			row.cells.filter((cell) => cell.isMine).forEach((cell) => (cell.visible = true))
		})
	}

	const resetBoard = (): void => {
		createBoard()
	}

	// Configuration setters
	const setDifficulty = (rows: number, columns: number, mines: number): void => {
		config.rows = rows
		config.columns = columns
		config.mines = mines
		resetBoard()
	}

	return {
		// State
		currentBoard,
		gameStatus,

		// Computed
		boardSize,
		isWinner,
		visibleCellsCount,

		// Actions
		createBoard,
		resetBoard,
		nearbyMineCount,
		getNearbyCells,
		clearNearbyCells,
		moveMine,
		toggleFlag,
		checkGameStatus,
		endGame,
		setDifficulty,
	}
})
