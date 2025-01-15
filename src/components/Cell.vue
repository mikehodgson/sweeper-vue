<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="cell prevent-select"
    :class="[{ highlight: isHighlighted, visible: model.visible }]"
    @mousedown="addHighlight"
    @mouseup="removeHighlight"
    @mouseleave="removeHighlight"
    @click="setVisible"
    @contextmenu="setFlagged"
  >
    <span v-if="model.isFlagged" class="flag">🏳️</span>
    <span v-else-if="model.visible && model.isMine" class="mine">💩</span>
    <span v-else-if="model.visible && !model.isMine && nearbyMines > 0" :class="severityColor">{{
      nearbyMines
    }}</span>
  </div>
</template>
<script setup lang="ts">
  import type { Cell } from '@/model/Cell'
  import { ref, type Ref, computed } from 'vue'
  import { useBoardStore } from '@/stores/useBoardStore'
  import { storeToRefs } from 'pinia'

  interface Props {
    disabled: boolean
  }

  const isHighlighted: Ref<boolean> = ref(false)

  const model = defineModel<Cell>({ required: true })
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
  })

  const { nearbyMineCount, moveMine } = useBoardStore()
  const { firstMoveCompleted } = storeToRefs(useBoardStore())

  const emits = defineEmits(['bomb-clicked', 'cell-flagged', 'cell-cleared'])

  const addHighlight = () => {
    if (!props.disabled) isHighlighted.value = true
  }

  const removeHighlight = () => {
    if (!props.disabled) isHighlighted.value = false
  }

  const setVisible = () => {
    if (!props.disabled)
      if (!model.value.isFlagged) {
        if (model.value.isMine && !firstMoveCompleted.value) {
          moveMine(model.value)
          emits('cell-cleared', model.value)
        } else if (model.value.isMine) {
          emits('bomb-clicked', model.value)
        } else {
          emits('cell-cleared', model.value)
        }
      }
    if (!firstMoveCompleted.value) firstMoveCompleted.value = true
  }

  const setFlagged = (evt: MouseEvent) => {
    evt.preventDefault()
    if (!props.disabled) {
      model.value.isFlagged = !model.value.visible ? !model.value.isFlagged : model.value.isFlagged
      emits('cell-flagged')
    }
  }

  const nearbyMines = computed(() => {
    return nearbyMineCount(model.value)
  })

  const severityColor = computed(() => {
    if (nearbyMines.value === 1) return 'nearby blue'
    if (nearbyMines.value === 2) return 'nearby yellow'
    if (nearbyMines.value >= 3) return 'nearby dark-red'
    return ''
  })
</script>
<style lang="css" scoped>
  .nearby {
    font-size: 1.5cqw;
  }
  .blue {
    color: blue;
  }
  .yellow {
    color: #a1a112;
  }
  .red {
    color: red;
  }
  .dark-red {
    color: darkred;
  }
  .mine {
    background-color: darkred;
  }
</style>
