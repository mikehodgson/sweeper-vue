import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../useUserStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a score of 0', () => {
    const store = useUserStore()
    expect(store.score).toBe(0)
  })

  it('increments the score', () => {
    const store = useUserStore()
    store.incrementScore()
    expect(store.score).toBe(1)
  })

  it('resets the score', () => {
    const store = useUserStore()
    store.incrementScore()
    store.resetScore()
    expect(store.score).toBe(0)
  })
})
