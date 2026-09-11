import type { CubeState } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"
import { cubeToCoordinates } from "./coordinates"
import {
  getCornerOrientationDistance,
  getESliceDistance,
} from "./pruningTables"
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

const DEFAULT_MAX_DEPTH = 20

const FACES = [
  "U",
  "D",
  "F",
  "B",
  "L",
  "R",
] as const

type FaceName = (typeof FACES)[number]

function isSolved(cube: CubeState): boolean {
  return FACES.every((face) => {
    const stickers = cube[face]
    const center = stickers[4]

    return stickers.every(
      (sticker) => sticker === center,
    )
  })
}

function moveFace(move: Move): FaceName {
  return move[0] as FaceName
}

function shouldSkipMove(
  move: Move,
  previousMove?: Move,
): boolean {
  if (!previousMove) {
    return false
  }

  const currentFace = moveFace(move)
  const previousFace = moveFace(previousMove)

  /*
   * Never make two consecutive turns
   * of the same face.
   */
  if (currentFace === previousFace) {
    return true
  }

  /*
   * Avoid searching both orders of moves
   * on opposite faces.
   *
   * Example:
   *
   * U D
   * D U
   *
   * produce equivalent search branches.
   */
  if (
    (currentFace === "U" && previousFace === "D") ||
    (currentFace === "D" && previousFace === "U")
  ) {
    return currentFace < previousFace
  }

  if (
    (currentFace === "F" && previousFace === "B") ||
    (currentFace === "B" && previousFace === "F")
  ) {
    return currentFace < previousFace
  }

  if (
    (currentFace === "L" && previousFace === "R") ||
    (currentFace === "R" && previousFace === "L")
  ) {
    return currentFace < previousFace
  }

  return false
}

function countMisplacedStickers(
  cube: CubeState,
): number {
  let misplaced = 0

  for (const face of FACES) {
    const stickers = cube[face]
    const center = stickers[4]

    for (let index = 0; index < 9; index++) {
      if (index === 4) {
        continue
      }

      if (stickers[index] !== center) {
        misplaced++
      }
    }
  }

  return misplaced
}

/*
 * A simple admissible lower-bound heuristic.
 *
 * Each face turn can affect at most 20 stickers.
 *
 * Therefore:
 *
 * misplaced / 20
 *
 * is a lower bound on the number of moves needed.
 *
 * We round upward.
 */
function heuristic(cube: CubeState): number {
  const stickerDistance = Math.ceil(
    countMisplacedStickers(cube) / 20,
  )

  const coordinates = cubeToCoordinates(cube)

  return Math.max(
    stickerDistance,
    getCornerOrientationDistance(coordinates),
    getESliceDistance(coordinates),
  )
}

function inverseMove(move: Move): Move {
  if (move.endsWith("2")) {
    return move
  }

  if (move.endsWith("'")) {
    return move.slice(0, -1) as Move
  }

  return `${move}'` as Move
}

type SearchResult =
  | {
      found: true
      path: Move[]
    }
  | {
      found: false
      nextBound: number
    }

function search(
  cube: CubeState,
  g: number,
  bound: number,
  path: Move[],
): SearchResult {
  const h = heuristic(cube)
  const f = g + h

  if (f > bound) {
    return {
      found: false,
      nextBound: f,
    }
  }

  if (isSolved(cube)) {
    return {
      found: true,
      path,
    }
  }

  let nextBound = Number.POSITIVE_INFINITY

  const previousMove =
    path[path.length - 1]

  for (const move of SEARCH_MOVES) {
    if (
      shouldSkipMove(
        move,
        previousMove,
      )
    ) {
      continue
    }

    /*
     * Avoid immediately undoing the previous move.
     */
    if (
      previousMove &&
      move === inverseMove(previousMove)
    ) {
      continue
    }

    const nextCube = applyMove(
      cube,
      move,
    )

    const result = search(
      nextCube,
      g + 1,
      bound,
      [...path, move],
    )

    if (result.found) {
      return result
    }

    nextBound = Math.min(
      nextBound,
      result.nextBound,
    )
  }

  return {
    found: false,
    nextBound,
  }
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

  let bound = heuristic(cube)

  while (bound <= maxDepth) {
    const result = search(
      cube,
      0,
      bound,
      [],
    )

    if (result.found) {
      return {
        solved: true,
        moves: result.path,
      }
    }

    if (
      result.nextBound ===
      Number.POSITIVE_INFINITY
    ) {
      break
    }

    bound = result.nextBound
  }

  return {
    solved: false,
    moves: [],
  }
}