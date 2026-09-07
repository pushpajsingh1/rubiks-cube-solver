import type { CubeState } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"

export type SolverResult = {
  solved: boolean
  moves: Move[]
}

const SEARCH_MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

const DEFAULT_MAX_DEPTH = 8

const FACES = ["U", "D", "F", "B", "L", "R"] as const

function isSolved(cube: CubeState): boolean {
  return FACES.every((face) => {
    const stickers = cube[face]
    const center = stickers[4]

    return stickers.every(
      (sticker) => sticker === center,
    )
  })
}

function cubeKey(cube: CubeState): string {
  return JSON.stringify([
    cube.U,
    cube.D,
    cube.F,
    cube.B,
    cube.L,
    cube.R,
  ])
}

function moveFace(move: Move): string {
  return move[0]
}

function shouldSkipMove(
  move: Move,
  previousMove?: Move,
): boolean {
  if (!previousMove) {
    return false
  }

  return moveFace(move) === moveFace(previousMove)
}

function misplacedStickers(cube: CubeState): number {
  let count = 0

  for (const face of FACES) {
    const stickers = cube[face]
    const center = stickers[4]

    for (let i = 0; i < 9; i++) {
      if (i !== 4 && stickers[i] !== center) {
        count++
      }
    }
  }

  return count
}

function orderedMoves(
  cube: CubeState,
  previousMove?: Move,
): Move[] {
  return SEARCH_MOVES
    .filter(
      (move) =>
        !shouldSkipMove(move, previousMove),
    )
    .map((move) => {
      const nextCube = applyMove(cube, move)

      return {
        move,
        score: misplacedStickers(nextCube),
      }
    })
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.move)
}

function search(
  cube: CubeState,
  depth: number,
  maxDepth: number,
  path: Move[],
  previousMove: Move | undefined,
  visited: Map<string, number>,
): Move[] | null {
  if (isSolved(cube)) {
    return path
  }

  if (depth >= maxDepth) {
    return null
  }

  const key = cubeKey(cube)
  const previousDepth = visited.get(key)

  if (
    previousDepth !== undefined &&
    previousDepth <= depth
  ) {
    return null
  }

  visited.set(key, depth)

  const moves = orderedMoves(cube, previousMove)

  for (const move of moves) {
    const nextCube = applyMove(cube, move)

    const result = search(
      nextCube,
      depth + 1,
      maxDepth,
      [...path, move],
      move,
      visited,
    )

    if (result !== null) {
      return result
    }
  }

  return null
}

export function solveCube(
  cube: CubeState,
  maxDepth: number = DEFAULT_MAX_DEPTH,
): SolverResult {
  if (isSolved(cube)) {
    return {
      solved: true,
      moves: [],
    }
  }

  for (let depth = 1; depth <= maxDepth; depth++) {
    const visited = new Map<string, number>()

    const result = search(
      cube,
      0,
      depth,
      [],
      undefined,
      visited,
    )

    if (result !== null) {
      return {
        solved: true,
        moves: result,
      }
    }
  }

  return {
    solved: false,
    moves: [],
  }
}