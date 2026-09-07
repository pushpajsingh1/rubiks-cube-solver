import type { CubeState } from "./CubeState"
import {
  moveU,
  moveU2,
  moveUPrime,
  moveR,
  moveR2,
  moveRPrime,
  moveF,
  moveF2,
  moveFPrime,
  moveL,
  moveL2,
  moveLPrime,
  moveD,
  moveD2,
  moveDPrime,
  moveB,
  moveB2,
  moveBPrime,
} from "./moves"

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

export function applyMove(cube: CubeState, move: Move): CubeState {
  switch (move) {
    case "U":
      return moveU(cube)
    case "U'":
      return moveUPrime(cube)
    case "U2":
      return moveU2(cube)

    case "R":
      return moveR(cube)
    case "R'":
      return moveRPrime(cube)
    case "R2":
      return moveR2(cube)

    case "F":
      return moveF(cube)
    case "F'":
      return moveFPrime(cube)
    case "F2":
      return moveF2(cube)

    case "L":
      return moveL(cube)
    case "L'":
      return moveLPrime(cube)
    case "L2":
      return moveL2(cube)

    case "D":
      return moveD(cube)
    case "D'":
      return moveDPrime(cube)
    case "D2":
      return moveD2(cube)

    case "B":
      return moveB(cube)
    case "B'":
      return moveBPrime(cube)
    case "B2":
      return moveB2(cube)

    default:
      throw new Error(`Invalid move: ${move}`)
  }
}

export function applySequence(
  cube: CubeState,
  sequence: Move[],
): CubeState {
  return sequence.reduce(
    (currentCube, move) => applyMove(currentCube, move),
    cube,
  )
}