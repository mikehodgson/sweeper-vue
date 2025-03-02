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
		expect((wrapper.props() as unknown as { modelValue: { id: number } }).modelValue.id).toBe(1)
		expect(
			(wrapper.props() as unknown as { modelValue: { visible: boolean } }).modelValue.visible,
		).toBe(true)
		expect(
			(wrapper.props() as unknown as { modelValue: { isMine: boolean } }).modelValue.isMine,
		).toBe(false)
		expect(
			(wrapper.props() as unknown as { modelValue: { isFlagged: boolean } }).modelValue
				.isFlagged,
		).toBe(false)
		expect((wrapper.props() as unknown as { modelValue: { row: number } }).modelValue.row).toBe(
			0,
		)
		expect(
			(wrapper.props() as unknown as { modelValue: { column: number } }).modelValue.column,
		).toBe(0)
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
		expect((wrapper.vm as unknown as { isHighlighted: boolean }).isHighlighted).toBe(true)
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
		expect((wrapper.vm as unknown as { isHighlighted: boolean }).isHighlighted).toBe(false)
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
		expect((wrapper.vm as unknown as { isHighlighted: boolean }).isHighlighted).toBe(false)
	})
	it('should toggle isFlagged when setFlagged is called', () => {
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
		const event: MouseEvent = new MouseEvent('contextmenu')
		;(wrapper.vm as unknown as { setFlagged: (event: MouseEvent) => boolean }).setFlagged(event)
		expect(
			(wrapper.vm as unknown as { modelValue: { isFlagged: boolean } }).modelValue.isFlagged,
		).toBe(true)
		;(wrapper.vm as unknown as { setFlagged: (event: MouseEvent) => boolean }).setFlagged(event)
		expect(
			(wrapper.vm as unknown as { modelValue: { isFlagged: boolean } }).modelValue.isFlagged,
		).toBe(false)
	})

	it('should not toggle isFlagged when disabled', () => {
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
		;(wrapper.vm as unknown as { setFlagged: (event: MouseEvent) => boolean }).setFlagged(event)
		expect(
			(wrapper.vm as unknown as { modelValue: { isFlagged: boolean } }).modelValue.isFlagged,
		).toBe(false)
	})

	it('should emit cell-flagged event', () => {
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
		;(wrapper.vm as unknown as { setFlagged: (event: MouseEvent) => boolean }).setFlagged(event)
		expect(wrapper.emitted()).toHaveProperty('cell-flagged')
	})
})
