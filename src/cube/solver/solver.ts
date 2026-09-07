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

function isSolved(cube: CubeState): boolean {
  const faces = ["U", "D", "F", "B", "L", "R"] as const

  return faces.every((face) => {
    const stickers = cube[face]

    return stickers.every(
      (sticker) => sticker === stickers[4],
    )
  })
}

function isRedundantMove(
  move: Move,
  previousMove?: Move,
): boolean {
  if (!previousMove) {
    return false
  }

  return move[0] === previousMove[0]
}

function cubeKey(cube: CubeState): string {
  return [
    ...cube.U,
    ...cube.D,
    ...cube.F,
    ...cube.B,
    ...cube.L,
    ...cube.R,
  ].join(",")
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

  for (const move of SEARCH_MOVES) {
    if (isRedundantMove(move, previousMove)) {
      continue
    }

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