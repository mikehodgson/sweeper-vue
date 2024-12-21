import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Game from '@/views/Game.vue'
import BoardComponent from '@/components/Board.vue'
import { useBoardStore } from '@/stores/useBoardStore'
import { createTestingPinia } from '@pinia/testing'
import { afterEach } from 'vitest'

const createWrapper = () => {
  return mount(Game, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: true })],
    },
  })
}

let wrapper = createWrapper()
let store = useBoardStore()

describe('Game.vue', () => {
  beforeEach(() => {
    wrapper = createWrapper()
    store = useBoardStore()
    store.createBoard()
  })

  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })

  it('renders the header', () => {
    expect(wrapper.find('h1').text()).toBe('sweeper')
  })

  it('renders the BoardComponent', () => {
    expect(wrapper.findComponent(BoardComponent).exists()).toBe(true)
  })

  it('shows "Game Over!" screen when game is over', async () => {
    await wrapper.vm.$nextTick()
    wrapper.vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.game-over-screen').exists()).toBe(true)
    expect(wrapper.find('.game-over-screen').text()).toBe('Game Over!')
  })

  it('resets gameOver when newGame is called', async () => {
    wrapper.vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    wrapper.vm.newGame()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.gameOver).toBe(false)
  })

  it('displays "New Game" button when game is over', async () => {
    wrapper.vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('New Game')
  })

  it('game should be reset when "New Game" button is clicked', async () => {
    const spy = vi.spyOn(wrapper.vm, 'newGame')
    wrapper.vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(spy).toHaveBeenCalled()
    expect(wrapper.vm.gameOver).toBe(false)
  })
})
