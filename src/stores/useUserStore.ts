import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const score: Ref<number> = ref(0)

  const incrementScore = () => {
    score.value++
  }

  const resetScore = () => {
    score.value = 0
  }

  return { score, incrementScore, resetScore }
})
