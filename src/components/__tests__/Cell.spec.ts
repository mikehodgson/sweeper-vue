import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Cell from '../Cell.vue'
import { createTestingPinia } from '@pinia/testing'

describe('Cell.vue', () => {
  it('renders cell with correct props', () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: true,
          isMine: false,
          isFlagged: false,
          row: 0,
          column: 0,
        },
        disabled: false,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    expect(wrapper.props().modelValue.id).toBe(1)
    expect(wrapper.props().modelValue.visible).toBe(true)
    expect(wrapper.props().modelValue.isMine).toBe(false)
    expect(wrapper.props().modelValue.isFlagged).toBe(false)
    expect(wrapper.props().modelValue.row).toBe(0)
    expect(wrapper.props().modelValue.column).toBe(0)
  })

  it('emits event when cell is clicked', async () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: true,
          isMine: false,
          isFlagged: false,
          row: 0,
          column: 0,
        },
        disabled: false,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cell-cleared')
  })

  it('renders mine icon if cell is a mine', () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: true,
          isMine: true,
          isFlagged: false,
          row: 0,
          column: 0,
        },
        disabled: false,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    expect(wrapper.html()).toContain('mine')
  })

  it('renders flag icon if cell is flagged', () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: true,
          isMine: false,
          isFlagged: true,
          row: 0,
          column: 0,
        },
        disabled: false,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    expect(wrapper.html()).toContain('flag')
  })
})
