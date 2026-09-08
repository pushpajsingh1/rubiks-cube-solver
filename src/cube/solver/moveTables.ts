import type { CubeState } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"
import {
  CORNERS,
  EDGES,
  cubeToCoordinates,
  type CubeCoordinates,
} from "./coordinates"

export const SOLVER_MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

export type MoveTable = {
  cornerPermutation: number[][]
  cornerOrientation: number[][]
  edgePermutation: number[][]
  edgeOrientation: number[][]
}

/**
 * Apply one move to a solved cube and return
 * the resulting coordinate representation.
 *
 * This is used to discover how each move transforms
 * the coordinate system.
 */
function getMoveCoordinates(
  move: Move,
): CubeCoordinates {
  const solved: CubeState = {
    U: Array(9).fill("white"),
    D: Array(9).fill("yellow"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
    L: Array(9).fill("orange"),
    R: Array(9).fill("red"),
  }

  return cubeToCoordinates(
    applyMove(solved, move),
  )
}

/**
 * Build the basic move tables.
 *
 * The tables contain the transformation caused by
 * each move when applied to the solved coordinate state.
 */
export function createMoveTables(): MoveTable {
  const cornerPermutation: number[][] = []
  const cornerOrientation: number[][] = []
  const edgePermutation: number[][] = []
  const edgeOrientation: number[][] = []

  for (const move of SOLVER_MOVES) {
    const coordinates = getMoveCoordinates(move)

    cornerPermutation.push([
      ...coordinates.cornerPermutation,
    ])

    cornerOrientation.push([
      ...coordinates.cornerOrientation,
    ])

    edgePermutation.push([
      ...coordinates.edgePermutation,
    ])

    edgeOrientation.push([
      ...coordinates.edgeOrientation,
    ])
  }

  return {
    cornerPermutation,
    cornerOrientation,
    edgePermutation,
    edgeOrientation,
  }
}

export const MOVE_TABLES = createMoveTables()

/**
 * Apply a precomputed move to a coordinate state.
 *
 * This is the function the actual solver will eventually
 * use instead of repeatedly manipulating sticker arrays.
 */
export function applyCoordinateMove(
  coordinates: CubeCoordinates,
  moveIndex: number,
): CubeCoordinates {
  if (
    moveIndex < 0 ||
    moveIndex >= SOLVER_MOVES.length
  ) {
    throw new Error(
      `Invalid move index: ${moveIndex}`,
    )
  }

  const cp = MOVE_TABLES.cornerPermutation[moveIndex]
  const co = MOVE_TABLES.cornerOrientation[moveIndex]
  const ep = MOVE_TABLES.edgePermutation[moveIndex]
  const eo = MOVE_TABLES.edgeOrientation[moveIndex]

  const cornerPermutation = Array(8)
  const cornerOrientation = Array(8)

  const edgePermutation = Array(12)
  const edgeOrientation = Array(12)

  for (let position = 0; position < 8; position++) {
    const piece = cp[position]

    cornerPermutation[position] =
      coordinates.cornerPermutation[piece]

    cornerOrientation[position] =
      (
        coordinates.cornerOrientation[piece] +
        co[position]
      ) % 3
  }

  for (let position = 0; position < 12; position++) {
    const piece = ep[position]

    edgePermutation[position] =
      coordinates.edgePermutation[piece]

    edgeOrientation[position] =
      (
        coordinates.edgeOrientation[piece] +
        eo[position]
      ) % 2
  }

  return {
    cornerPermutation,
    cornerOrientation,
    edgePermutation,
    edgeOrientation,
  }
}

/**
 * Apply a sequence of coordinate moves.
 */
export function applyCoordinateMoves(
  coordinates: CubeCoordinates,
  moves: Move[],
): CubeCoordinates {
  let current = coordinates

  for (const move of moves) {
    const index = SOLVER_MOVES.indexOf(move)

    if (index === -1) {
      throw new Error(`Invalid move: ${move}`)
    }

    current = applyCoordinateMove(
      current,
      index,
    )
  }

  return current
}

/**
 * Return the solved coordinate state.
 */
export function solvedCoordinates(): CubeCoordinates {
  return {
    cornerPermutation: [
      ...CORNERS.map((_, index) => index),
    ],

    cornerOrientation: Array(8).fill(0),

    edgePermutation: [
      ...EDGES.map((_, index) => index),
    ],

    edgeOrientation: Array(12).fill(0),
  }
}