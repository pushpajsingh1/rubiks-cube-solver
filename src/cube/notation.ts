export type Move = string

const validMoves = new Set([
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
])

export function isValidMove(move: string): boolean {
  return validMoves.has(move)
}

export function inverseMove(move: Move): Move {
  if (!isValidMove(move)) {
    throw new Error(`Invalid move: ${move}`)
  }

  if (move.endsWith("2")) {
    return move
  }

  if (move.endsWith("'")) {
    return move.slice(0, -1)
  }

  return `${move}'`
}

export function inverseSequence(sequence: Move[]): Move[] {
  return [...sequence]
    .reverse()
    .map(inverseMove)
}