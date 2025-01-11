import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import routes from '@/router'
import { createTestingPinia } from '@pinia/testing'
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

const router = createRouter({
  history: createWebHistory(),
  routes: routes.getRoutes(),
})

const createWrapper = () => {
  return mount(App, {
    global: { plugins: [router, createTestingPinia({ createSpy: vi.fn }), i18n] },
  })
}

describe('App.vue', () => {
  it('renders RouterView component', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(RouterView).exists()).toBe(true)
  })

  it('has a div with class "content"', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('div.content').exists()).toBe(true)
  })
})
