<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="header">
    <h1>{{ t('title') }}</h1>
    <button type="button" v-if="gameOver" @click="newGame">{{ t('new_game') }}</button>
  </div>
  <BoardComponent
    @game-over="showGameOverScreen"
    :class="[{ fadeOut: gameOver }]"
    :disabled="gameOver"
  />
  <div class="game-over-screen" v-if="gameOver">{{ t('game_over') }}</div>
</template>
<script setup lang="ts">
  import BoardComponent from '@/components/Board.vue'
  import { useBoardStore } from '@/stores/useBoardStore'
  import { useUserStore } from '@/stores/useUserStore'
  import { storeToRefs } from 'pinia'
  import { ref, type Ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { resetBoard } = useBoardStore()
  const { firstMoveCompleted } = storeToRefs(useUserStore())

  const gameOver: Ref<boolean> = ref(false)

  const showGameOverScreen = () => {
    gameOver.value = true
  }

  const newGame = () => {
    resetBoard()
    firstMoveCompleted.value = false
    gameOver.value = false
  }

  newGame()
</script>
