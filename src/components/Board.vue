<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="board">
    <template v-for="(row, row_idx) in currentBoard.rows">
      <template v-for="(cell, cell_idx) in row.cells" :key="`${row_idx}_${cell_idx}`">
        <CellComponent
          :cellLocation="{ row: row_idx, column: cell_idx }"
          v-model="currentBoard.rows[row_idx].cells[cell_idx]"
          @bomb-clicked="bombFound"
          @cell-flagged="cellFlagged"
          @cell-cleared="cellCleared"
          :disabled="props.disabled"
        ></CellComponent>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import CellComponent from './Cell.vue'
  import { useBoardStore } from '@/stores/useBoardStore'
  import type { Cell } from '@/model/Cell'

  interface Props {
    disabled: boolean
  }

  const { currentBoard } = storeToRefs(useBoardStore())
  const { getNearbyCells, nearbyMineCount } = useBoardStore()

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
  })
  const emits = defineEmits(['game-over'])

  const bombFound = (cell: Cell) => {
    cell.visible = true
    console.log('💣 bomb found!')
    emits('game-over')
  }

  const cellFlagged = () => {
    console.log('🏳️ cell flagged!')
  }

  const clearNearbyCells = (cell: Cell) => {
    if (cell.isMine || cell.visible) return

    cell.visible = true

    if (nearbyMineCount(cell) !== 0) return

    getNearbyCells(cell)
      .filter((nearbyCell) => !nearbyCell.isMine && !nearbyCell.visible)
      .forEach(clearNearbyCells)
  }

  const cellCleared = (cell: Cell) => {
    clearNearbyCells(cell)
    console.log('✔️ cell cleared!')
  }
</script>
