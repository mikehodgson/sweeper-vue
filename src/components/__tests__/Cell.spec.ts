import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Cell from '../Cell.vue'
import { createTestingPinia } from '@pinia/testing'
import { ref } from 'vue'

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

  it('adds highlight on mousedown', async () => {
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
    await wrapper.trigger('mousedown')
    expect(wrapper.findComponent(Cell).vm.isHighlighted).toBe(true)
  })

  it('removes highlight on mouseup', async () => {
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
    await wrapper.trigger('mousedown')
    await wrapper.trigger('mouseup')
    expect(wrapper.findComponent(Cell).vm.isHighlighted).toBe(false)
  })

  it('removes highlight on mouseleave', async () => {
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
    await wrapper.trigger('mousedown')
    await wrapper.trigger('mouseleave')
    expect(wrapper.findComponent(Cell).vm.isHighlighted).toBe(false)
  })
  it('should toggle isFlagged when setFlagged is called', async () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: false,
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
    const event = new MouseEvent('contextmenu')
    await wrapper.findComponent(Cell).vm.setFlagged(event)
    expect(wrapper.vm.modelValue.isFlagged).toBe(true)
    await wrapper.findComponent(Cell).vm.setFlagged(event)
    expect(wrapper.vm.modelValue.isFlagged).toBe(false)
  })

  it('should not toggle isFlagged when disabled', async () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: false,
          isMine: false,
          isFlagged: false,
          row: 0,
          column: 0,
        },
        disabled: true,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    const event = new MouseEvent('contextmenu')
    await wrapper.findComponent(Cell).vm.setFlagged(event)
    expect(wrapper.vm.modelValue.isFlagged).toBe(false)
  })

  it('should emit cell-flagged event', async () => {
    const wrapper = mount(Cell, {
      props: {
        modelValue: {
          id: 1,
          visible: false,
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
    const event = new MouseEvent('contextmenu')
    await wrapper.findComponent(Cell).vm.setFlagged(event)
    expect(wrapper.emitted()).toHaveProperty('cell-flagged')
  })
})
