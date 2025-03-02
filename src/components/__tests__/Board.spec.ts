import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Board from '@/components/Board.vue'
import { createTestingPinia } from '@pinia/testing'
import { useBoardStore } from '@/stores/useBoardStore'
import { storeToRefs } from 'pinia'
import type { Cell } from '@/model/Cell'

const createWrapper = () => {
	return mount(Board, {
		global: {
			plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
		},
		props: {
			disabled: false,
		},
	})
}

describe('Board.vue', () => {
	it('renders board correctly', () => {
		const wrapper = createWrapper()
		expect(wrapper.find('.board').exists()).toBe(true)
	})

	it('emits game-over when bomb is found', () => {
		const wrapper = createWrapper()
		const store = useBoardStore()
		const cell: Cell = { isMine: true, visible: false, row: 0, column: 0 }
		store.currentBoard = { rows: [{ cells: [cell] }], active: true }
		;(wrapper.vm as unknown as { bombFound: (cell: Cell) => void }).bombFound(cell)
		expect(cell.visible).toBe(true)
		expect(wrapper.emitted('game-over')).toBeTruthy()
	})

	it('clears nearby cells correctly', () => {
		const wrapper = createWrapper()
		const store = useBoardStore()
		const { currentBoard } = storeToRefs(store)
		const cell: Cell = { isMine: false, visible: false, row: 0, column: 0 }
		const nearbyCell: Cell = { isMine: false, visible: false, row: 1, column: 0 }
		currentBoard.value = { rows: [{ cells: [cell, nearbyCell] }], active: true }
		;(wrapper.vm as unknown as { cellCleared: (cell: Cell) => void }).cellCleared(cell)
		expect(cell.visible).toBe(true)
		expect(nearbyCell.visible).toBe(true)
	})
})
