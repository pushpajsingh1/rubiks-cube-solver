import {
  decodeCornerOrientation,
  decodeESliceEdgePermutation,
  encodeCornerOrientation,
  encodeESlice,
  encodeEdgeOrientation,
} from "./coordinateEncoding"
import {
  applyCoordinateMove,
  SOLVER_MOVES,
  solvedCoordinates,
} from "./moveTables"

export const CORNER_ORIENTATION_COUNT = 3 ** 7
export const EDGE_ORIENTATION_COUNT = 2 ** 11
export const ESLICE_COUNT = 495

export const MOVE_COUNT = SOLVER_MOVES.length

/**
 * Coordinate transition table for corner orientation.
 *
 * Index:
 *   coordinate * MOVE_COUNT + moveIndex
 *
 * Value:
 *   resulting coordinate
 */
function buildCornerOrientationMoveTable(): Uint16Array {
  const table = new Uint16Array(
    CORNER_ORIENTATION_COUNT * MOVE_COUNT,
  )

  for (
    let coordinate = 0;
    coordinate < CORNER_ORIENTATION_COUNT;
    coordinate++
  ) {
    const coordinates = solvedCoordinates()

    coordinates.cornerOrientation =
      decodeCornerOrientation(coordinate)

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        coordinates,
        moveIndex,
      )

      table[
        coordinate * MOVE_COUNT + moveIndex
      ] = encodeCornerOrientation(next)
    }
  }

  return table
}

/**
 * Coordinate transition table for edge orientation.
 */
function buildEdgeOrientationMoveTable(): Uint16Array {
  const table = new Uint16Array(
    EDGE_ORIENTATION_COUNT * MOVE_COUNT,
  )

  for (
    let coordinate = 0;
    coordinate < EDGE_ORIENTATION_COUNT;
    coordinate++
  ) {
    const coordinates = solvedCoordinates()

    /*
     * Decode the first 11 edge orientations.
     * The twelfth orientation is determined by parity.
     */
    const orientation = Array(12).fill(0)
    let remaining = coordinate

    for (
      let position = 10;
      position >= 0;
      position--
    ) {
      orientation[position] =
        remaining % 2

      remaining = Math.floor(
        remaining / 2,
      )
    }

    const sum = orientation
      .slice(0, 11)
      .reduce(
        (total, value) => total + value,
        0,
      )

    orientation[11] = sum % 2

    coordinates.edgeOrientation =
      orientation

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        coordinates,
        moveIndex,
      )

      table[
        coordinate * MOVE_COUNT + moveIndex
      ] = encodeEdgeOrientation(next)
    }
  }

  return table
}

/**
 * Coordinate transition table for E-slice position.
 */
function buildESliceMoveTable(): Uint16Array {
  const table = new Uint16Array(
    ESLICE_COUNT * MOVE_COUNT,
  )

  for (
    let coordinate = 0;
    coordinate < ESLICE_COUNT;
    coordinate++
  ) {
    const coordinates = solvedCoordinates()

    coordinates.edgePermutation =
      decodeESliceEdgePermutation(
        coordinate,
      )

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        coordinates,
        moveIndex,
      )

      table[
        coordinate * MOVE_COUNT + moveIndex
      ] = encodeESlice(next)
    }
  }

  return table
}

export const CORNER_ORIENTATION_MOVE_TABLE =
  buildCornerOrientationMoveTable()

export const EDGE_ORIENTATION_MOVE_TABLE =
  buildEdgeOrientationMoveTable()

export const ESLICE_MOVE_TABLE =
  buildESliceMoveTable()

/**
 * Get the next corner-orientation coordinate.
 */
export function nextCornerOrientation(
  coordinate: number,
  moveIndex: number,
): number {
  return CORNER_ORIENTATION_MOVE_TABLE[
    coordinate * MOVE_COUNT + moveIndex
  ]
}

/**
 * Get the next edge-orientation coordinate.
 */
export function nextEdgeOrientation(
  coordinate: number,
  moveIndex: number,
): number {
  return EDGE_ORIENTATION_MOVE_TABLE[
    coordinate * MOVE_COUNT + moveIndex
  ]
}

/**
 * Get the next E-slice coordinate.
 */
export function nextESlice(
  coordinate: number,
  moveIndex: number,
): number {
  return ESLICE_MOVE_TABLE[
    coordinate * MOVE_COUNT + moveIndex
  ]
}