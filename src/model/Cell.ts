interface Cell {
  id?: number
  visible?: boolean
  isMine?: boolean
  isFlagged?: boolean
  row: number
  column: number
}

export { type Cell }
