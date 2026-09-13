import {
  EDGE_ORIENTATION_COUNT,
  ESLICE_COUNT,
  CORNER_ORIENTATION_COUNT,
  MOVE_COUNT,
  nextCornerOrientation,
  nextEdgeOrientation,
  nextESlice,
} from "./coordinateMoveTables"

export const EDGE_ORIENTATION_PRUNING_SIZE =
  EDGE_ORIENTATION_COUNT

export const CORNER_ORIENTATION_PRUNING_SIZE =
  CORNER_ORIENTATION_COUNT

export const ESLICE_PRUNING_SIZE =
  ESLICE_COUNT

export const PHASE1_PRUNING_SIZE =
  CORNER_ORIENTATION_COUNT * ESLICE_COUNT

function buildSingleCoordinatePruningTable(
  size: number,
  nextCoordinate: (
    coordinate: number,
    moveIndex: number,
  ) => number,
): Uint8Array {
  const table = new Uint8Array(size)

  table.fill(255)
  table[0] = 0

  const queue = new Uint16Array(size)
  let head = 0
  let tail = 1

  queue[0] = 0

  while (head < tail) {
    const current = queue[head++]
    const distance = table[current]

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const next = nextCoordinate(
        current,
        moveIndex,
      )

      if (table[next] !== 255) {
        continue
      }

      table[next] = distance + 1
      queue[tail++] = next
    }
  }

  return table
}

function buildPhase1PruningTable(): Uint8Array {
  const table = new Uint8Array(
    PHASE1_PRUNING_SIZE,
  )

  table.fill(255)

  const queue = new Uint32Array(
    PHASE1_PRUNING_SIZE,
  )

  const start = 0

  table[start] = 0
  queue[0] = start

  let head = 0
  let tail = 1

  while (head < tail) {
    const current = queue[head++]
    const distance = table[current]

    const cornerOrientation =
      Math.floor(
        current / ESLICE_COUNT,
      )

    const eSlice =
      current % ESLICE_COUNT

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const nextCornerOrientation =
        nextCornerOrientationCoordinate(
          cornerOrientation,
          moveIndex,
        )

      const nextSlice =
        nextESlice(
          eSlice,
          moveIndex,
        )

      const next =
        nextCornerOrientation *
          ESLICE_COUNT +
        nextSlice

      if (table[next] !== 255) {
        continue
      }

      table[next] = distance + 1
      queue[tail++] = next
    }
  }

  return table
}

function nextCornerOrientationCoordinate(
  coordinate: number,
  moveIndex: number,
): number {
  return nextCornerOrientation(
    coordinate,
    moveIndex,
  )
}

export const EDGE_ORIENTATION_PRUNING_TABLE =
  buildSingleCoordinatePruningTable(
    EDGE_ORIENTATION_COUNT,
    nextEdgeOrientation,
  )

export const CORNER_ORIENTATION_PRUNING_TABLE =
  buildSingleCoordinatePruningTable(
    CORNER_ORIENTATION_COUNT,
    nextCornerOrientation,
  )

export const ESLICE_PRUNING_TABLE =
  buildSingleCoordinatePruningTable(
    ESLICE_COUNT,
    nextESlice,
  )

export const PHASE1_PRUNING_TABLE =
  buildPhase1PruningTable()

export function getEdgeOrientationDistance(
  coordinate: number,
): number {
  return EDGE_ORIENTATION_PRUNING_TABLE[
    coordinate
  ]
}

export function getCornerOrientationDistance(
  coordinate: number,
): number {
  return CORNER_ORIENTATION_PRUNING_TABLE[
    coordinate
  ]
}

export function getESliceDistance(
  coordinate: number,
): number {
  return ESLICE_PRUNING_TABLE[
    coordinate
  ]
}

export function getPhase1Distance(
  cornerOrientation: number,
  eSlice: number,
): number {
  return PHASE1_PRUNING_TABLE[
    cornerOrientation *
      ESLICE_COUNT +
      eSlice
  ]
}