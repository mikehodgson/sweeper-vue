import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Board from '@/components/Board.vue'
import { createTestingPinia } from '@pinia/testing'
import { useBoardStore } from '@/stores/useBoardStore'
import { storeToRefs } from 'pinia'

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

  it('emits game-over when bomb is found', async () => {
    const wrapper = createWrapper()
    const store = useBoardStore()
    const cell = { isMine: true, visible: false, row: 0, column: 0, disabled: false }
    store.currentBoard = { rows: [{ cells: [cell] }], active: true }

    await wrapper.findComponent(Board).vm.bombFound(cell)
    expect(cell.visible).toBe(true)
    expect(wrapper.emitted('game-over')).toBeTruthy()
  })

  it('clears nearby cells correctly', async () => {
    const wrapper = createWrapper()
    const store = useBoardStore()
    const { currentBoard } = storeToRefs(store)
    const cell = { isMine: false, visible: false, row: 0, column: 0, disabled: false }
    const nearbyCell = { isMine: false, visible: false, row: 1, column: 0, disabled: false }
    currentBoard.value = { rows: [{ cells: [cell, nearbyCell] }], active: true }

    await wrapper.findComponent(Board).vm.cellCleared(cell)
    expect(cell.visible).toBe(true)
    expect(nearbyCell.visible).toBe(true)
  })
})
