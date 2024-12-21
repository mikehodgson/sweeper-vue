<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="header">
    <h1>sweeper</h1>
    <button type="button" v-if="gameOver" @click="newGame">New Game</button>
  </div>
  <BoardComponent
    @game-over="showGameOverScreen"
    :class="[{ fadeOut: gameOver }]"
    :disabled="gameOver"
  ></BoardComponent>
  <div class="game-over-screen" v-if="gameOver">Game Over!</div>
</template>
<script setup lang="ts">
  import BoardComponent from '@/components/Board.vue'
  import { useBoardStore } from '@/stores/useBoardStore'
  import { ref, type Ref } from 'vue'
  // import gameOverSound from '../assets/game-over.mp3'

  const { resetBoard } = useBoardStore()

  const gameOver: Ref<boolean> = ref(false)

  const showGameOverScreen = () => {
    gameOver.value = true
    // new Audio(gameOverSound).play()
  }

  const newGame = () => {
    resetBoard()
    gameOver.value = false
  }

  newGame()
</script>
