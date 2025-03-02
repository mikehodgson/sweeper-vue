import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const score: Ref<number> = ref(0)
	const startTime: Ref<number> = ref(0)
	const totalTime: Ref<string> = ref('')
	const firstMoveCompleted: Ref<boolean> = ref(false)

	const incrementScore = () => {
		score.value++
	}

	const resetScore = () => {
		score.value = 0
	}

	const startTimer = () => {
		console.log('startTimer')
		startTime.value = Date.now()
	}

	const stopTimer = () => {
		console.log('stopTimer')
		totalTime.value = ((Date.now() - startTime.value) / 1000).toFixed(2)
		console.log(totalTime.value)
	}

	watch(
		() => firstMoveCompleted.value,
		(value) => {
			if (value) {
				startTimer()
			}
		},
		{ immediate: true },
	)

	return {
		score,
		startTime,
		totalTime,
		firstMoveCompleted,
		incrementScore,
		resetScore,
		startTimer,
		stopTimer,
	}
})
