<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="board">
		<template v-for="(row, row_idx) in currentBoard.rows">
			<template v-for="(cell, cell_idx) in row.cells" :key="`${row_idx}_${cell_idx}`">
				<CellComponent
					:cellLocation="{ row: row_idx, column: cell_idx }"
					v-model="currentBoard.rows[row_idx].cells[cell_idx]"
					@bomb-clicked="bombFound"
					@cell-cleared="cellCleared"
					@cell-flagged="cellFlagged"
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

	const { currentBoard, isWinner } = storeToRefs(useBoardStore())
	const { clearNearbyCells } = useBoardStore()

	const props = withDefaults(defineProps<Props>(), {
		disabled: false,
	})

	const emits = defineEmits(['game-over'])

	const bombFound = (cell: Cell) => {
		cell.visible = true
		emits('game-over')
	}

	const cellCleared = (cell: Cell) => {
		clearNearbyCells(cell)
		if (isWinner.value == true) {
			emits('game-over')
		}
	}

	const cellFlagged = () => {
		if (isWinner.value == true) {
			emits('game-over')
		}
	}
</script>
