import type { CubeCoordinates } from "./coordinates"
import {
  applyCoordinateMove,
  SOLVER_MOVES,
  solvedCoordinates,
} from "./moveTables"
import {
  decodeCornerOrientation,
  decodeESliceEdgePermutation,
  encodeCornerOrientation,
  encodeESlice,
} from "./coordinateEncoding"

export const CORNER_ORIENTATION_TABLE_SIZE = 3 ** 7

function buildCornerOrientationPruningTable(): Int8Array {
  const distances = new Int8Array(
    CORNER_ORIENTATION_TABLE_SIZE,
  )

  distances.fill(-1)

  const queue: CubeCoordinates[] = [
    solvedCoordinates(),
  ]

  distances[
    encodeCornerOrientation(queue[0])
  ] = 0

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head]

    const currentIndex =
      encodeCornerOrientation(current)

    const nextDistance =
      distances[currentIndex] + 1

    for (
      let moveIndex = 0;
      moveIndex < SOLVER_MOVES.length;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        current,
        moveIndex,
      )

      const nextIndex =
        encodeCornerOrientation(next)

      if (distances[nextIndex] !== -1) {
        continue
      }

      distances[nextIndex] = nextDistance
      queue.push(next)
    }
  }

  return distances
}

export const CORNER_ORIENTATION_PRUNING_TABLE =
  buildCornerOrientationPruningTable()

export function getCornerOrientationDistance(
  coordinates: CubeCoordinates,
): number {
  return CORNER_ORIENTATION_PRUNING_TABLE[
    encodeCornerOrientation(coordinates)
  ]
}
export const ESLICE_TABLE_SIZE = 495

function buildESlicePruningTable(): Int8Array {
  const distances = new Int8Array(
    ESLICE_TABLE_SIZE,
  )

  distances.fill(-1)

  const queue: CubeCoordinates[] = [
    solvedCoordinates(),
  ]

  distances[encodeESlice(queue[0])] = 0

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head]

    const currentIndex = encodeESlice(current)
    const nextDistance =
      distances[currentIndex] + 1

    for (
      let moveIndex = 0;
      moveIndex < SOLVER_MOVES.length;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        current,
        moveIndex,
      )

      const nextIndex = encodeESlice(next)

      if (distances[nextIndex] !== -1) {
        continue
      }

      distances[nextIndex] = nextDistance
      queue.push(next)
    }
  }

  return distances
}

export const ESLICE_PRUNING_TABLE =
  buildESlicePruningTable()

export function getESliceDistance(
  coordinates: CubeCoordinates,
): number {
  return ESLICE_PRUNING_TABLE[
    encodeESlice(coordinates)
  ]
}
export const PHASE1_TABLE_SIZE =
  CORNER_ORIENTATION_TABLE_SIZE *
  ESLICE_TABLE_SIZE

export function encodePhase1(
  coordinates: CubeCoordinates,
): number {
  return (
    encodeCornerOrientation(coordinates) *
      ESLICE_TABLE_SIZE +
    encodeESlice(coordinates)
  )
}

export function decodePhase1(
  index: number,
): CubeCoordinates {
  if (
    index < 0 ||
    index >= PHASE1_TABLE_SIZE
  ) {
    throw new Error(
      `Invalid phase-1 index: ${index}`,
    )
  }

  const cornerOrientationIndex =
    Math.floor(index / ESLICE_TABLE_SIZE)

  const eSliceIndex =
    index % ESLICE_TABLE_SIZE

  const coordinates = solvedCoordinates()

  coordinates.cornerOrientation =
    decodeCornerOrientation(
      cornerOrientationIndex,
    )

  coordinates.edgePermutation =
    decodeESliceEdgePermutation(eSliceIndex)

  return coordinates
}

function buildPhase1PruningTable(): Int8Array {
  const distances = new Int8Array(
    PHASE1_TABLE_SIZE,
  )

  distances.fill(-1)

  const queue = new Int32Array(
    PHASE1_TABLE_SIZE,
  )

  let head = 0
  let tail = 1

  queue[0] = 0
  distances[0] = 0

  while (head < tail) {
    const currentIndex = queue[head++]

    const current = decodePhase1(currentIndex)

    const nextDistance =
      distances[currentIndex] + 1

    for (
      let moveIndex = 0;
      moveIndex < SOLVER_MOVES.length;
      moveIndex++
    ) {
      const next = applyCoordinateMove(
        current,
        moveIndex,
      )

      const nextIndex = encodePhase1(next)

      if (distances[nextIndex] !== -1) {
        continue
      }

      distances[nextIndex] = nextDistance
      queue[tail++] = nextIndex
    }
  }

  return distances
}

export const PHASE1_PRUNING_TABLE =
  buildPhase1PruningTable()

export function getPhase1Distance(
  coordinates: CubeCoordinates,
): number {
  return PHASE1_PRUNING_TABLE[
    encodePhase1(coordinates)
  ]
}
