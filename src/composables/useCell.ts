import type { Cell } from '@/model/Cell'

const useCell = () => {
	const createCell = (params: Cell) => {
		const cell: Cell = Object.assign(
			{},
			{ id: null, isFlagged: false, isMine: false, visible: false, row: null, column: null },
			params,
		)
		return cell
	}

	return { createCell }
}

export default useCell
