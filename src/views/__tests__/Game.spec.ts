import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Game from '@/views/Game.vue'
import BoardComponent from '@/components/Board.vue'
import { useBoardStore } from '@/stores/useBoardStore'
import { createTestingPinia } from '@pinia/testing'
import { afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      title: 'Sweeper',
      new_game: 'New Game',
      game_over: 'Game Over!',
    },
    fr: {
      title: 'Démineur',
      new_game: 'Nouvelle partie',
      game_over: 'Jeu terminé!',
    },
  },
})

const createWrapper = () => {
  return mount(Game, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: true }), i18n],
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
    expect(wrapper.find('h1').text()).toBe('Sweeper')
  })

  it('renders the BoardComponent', () => {
    expect(wrapper.findComponent(BoardComponent).exists()).toBe(true)
  })

  it('shows "Game Over!" screen when game is over', async () => {
    await wrapper.vm.$nextTick()
    wrapper.findComponent(Game).vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.game-over-screen').exists()).toBe(true)
    expect(wrapper.find('.game-over-screen').text()).toBe('Game Over!')
  })

  it('resets gameOver when newGame is called', async () => {
    wrapper.findComponent(Game).vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    wrapper.findComponent(Game).vm.newGame()
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(Game).vm.gameOver).toBe(false)
  })

  it('displays "New Game" button when game is over', async () => {
    wrapper.findComponent(Game).vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('New Game')
  })

  it('game should be reset when "New Game" button is clicked', async () => {
    const spy = vi.spyOn(wrapper.findComponent(Game).vm, 'newGame')
    wrapper.findComponent(Game).vm.showGameOverScreen()
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')
    expect(spy).toHaveBeenCalled()
    expect(wrapper.findComponent(Game).vm.gameOver).toBe(false)
  })
})
