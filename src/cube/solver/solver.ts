import type { CubeState } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"
import {
  solvePhase1,
} from "./phase1"
import {
  solvePhase2,
} from "./phase2"

export type SolverResult = {
  solved: boolean
  moves: Move[]
}

const DEFAULT_MAX_DEPTH = 30
const MAX_PHASE1_DEPTH = 12
const MAX_PHASE2_DEPTH = 20

const FACES = [
  "U",
  "D",
  "F",
  "B",
  "L",
  "R",
] as const

function isSolved(cube: CubeState): boolean {
  return FACES.every((face) => {
    const stickers = cube[face]
    const center = stickers[4]

    return stickers.every(
      (sticker) => sticker === center,
    )
  })
}

function applyMoves(
  cube: CubeState,
  moves: Move[],
): CubeState {
  let result = cube

  for (const move of moves) {
    result = applyMove(result, move)
  }

  return result
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

  /*
   * Phase 1:
   *
   * Transform the cube into the G1 subgroup by solving:
   * - corner orientation
   * - edge orientation
   * - E-slice membership
   */
  const phase1Depth = Math.min(
    MAX_PHASE1_DEPTH,
    maxDepth,
  )

  const phase1 = solvePhase1(
    cube,
    phase1Depth,
  )

  if (!phase1.found) {
    return {
      solved: false,
      moves: [],
    }
  }

  /*
   * Apply Phase 1 so that Phase 2 starts
   * from the actual G1 state found above.
   */
  const phase1Cube = applyMoves(
    cube,
    phase1.moves,
  )

  /*
   * Phase 2:
   *
   * Solve the remaining permutation using only:
   * U, U', U2
   * D, D', D2
   * R2, L2, F2, B2
   */
  const remainingDepth =
    maxDepth - phase1.moves.length

  if (remainingDepth < 0) {
    return {
      solved: false,
      moves: [],
    }
  }

  const phase2 = solvePhase2(
    phase1Cube,
    Math.min(
      MAX_PHASE2_DEPTH,
      remainingDepth,
    ),
  )

  if (!phase2.found) {
    return {
      solved: false,
      moves: [],
    }
  }

  const solution: Move[] = [
    ...phase1.moves,
    ...phase2.moves,
  ]

  /*
   * Final safety check.
   *
   * Never report a solution unless applying the
   * complete move sequence actually solves the cube.
   */
  const finalCube = applyMoves(
    cube,
    solution,
  )

  if (!isSolved(finalCube)) {
    return {
      solved: false,
      moves: [],
    }
  }

  return {
    solved: true,
    moves: solution,
  }
}