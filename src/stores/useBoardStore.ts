import type { Board } from '@/model/Board'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import useCell from '@/composables/useCell'
import type { Row } from '@/model/Row'
import type { Cell } from '@/model/Cell'

export const useBoardStore = defineStore('board', () => {
  const boardRows: number = 16
  const boardColumns: number = 16
  const mineCount: number = 40
  const currentBoard: Ref<Board> = ref({ rows: [] as Row[], active: true } as Board)

  const { createCell } = useCell()

  const createBoard = () => {
    let count = 1
    currentBoard.value = { rows: [], active: true }
    for (let r = 0; r < boardRows; r++) {
      currentBoard.value.rows[r] = { cells: [] }
      for (let c = 0; c < boardColumns; c++) {
        count++
        currentBoard.value.rows[r].cells.push(createCell({ id: count, row: r, column: c }))
      }
    }
    addMines()
  }

  const addMines = () => {
    const usedIndexes = new Set<string>()
    while (usedIndexes.size < mineCount) {
      const row = Math.floor(Math.random() * boardRows)
      const column = Math.floor(Math.random() * boardColumns)
      const key = `${row},${column}`
      if (!usedIndexes.has(key)) {
        usedIndexes.add(key)
        currentBoard.value.rows[row].cells[column].isMine = true
      }
    }
  }

  const moveMine = (cell: Cell) => {
    cell.isMine = false
    let row: number
    let column: number
    do {
      row = Math.floor(Math.random() * boardRows)
      column = Math.floor(Math.random() * boardColumns)
    } while (currentBoard.value.rows[row].cells[column].isMine)
    currentBoard.value.rows[row].cells[column].isMine = true
  }

  const getNearbyCells = (location: Cell) => {
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
      .filter((cell) => cell !== undefined)
  }

  const nearbyMineCount = (location: Cell) => {
    if (location === undefined) return 0
    const result = getNearbyCells(location).filter((cell) => cell.isMine)
    return result.length || 0
  }

  const clearNearbyCells = (cell: Cell) => {
    if (cell.isMine || cell.visible) return

    cell.visible = true

    if (nearbyMineCount(cell) !== 0) return

    getNearbyCells(cell)
      .filter((nearbyCell) => nearbyCell && !nearbyCell.isMine && !nearbyCell.visible)
      .forEach(clearNearbyCells)
  }

  const resetBoard = () => {
    createBoard()
  }

  const boardSize = computed(() => {
    return boardColumns * boardRows
  })

  const isWinner = computed(() => {
    const cells = currentBoard.value.rows.flatMap((row) => row.cells)
    return cells.every((cell) => (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.visible))
  })

  return {
    boardSize,
    currentBoard,
    isWinner,
    createBoard,
    resetBoard,
    nearbyMineCount,
    getNearbyCells,
    clearNearbyCells,
    moveMine,
  }
})
