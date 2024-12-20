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
    currentBoard.value = { rows: [], active: true }
    let count = 1
    for (let r = 0; r < boardRows; r++) {
      const row: Row = { cells: [] }
      for (let c = 0; c < boardColumns; c++) {
        row.cells.push(createCell({ id: count++, row: r, column: c }))
      }
      currentBoard.value.rows.push(row)
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
    if (!location) return 0
    return getNearbyCells(location).reduce((count, cell) => count + (cell.isMine ? 1 : 0), 0)
  }

  const resetBoard = () => {
    createBoard()
  }

  const boardSize = computed(() => {
    return boardColumns * boardRows
  })

  return { boardSize, currentBoard, createBoard, resetBoard, nearbyMineCount, getNearbyCells }
})
