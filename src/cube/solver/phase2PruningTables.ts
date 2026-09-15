import {
  CORNER_PERMUTATION_COUNT,
  UD_EDGE_PERMUTATION_COUNT,
  ESLICE_PERMUTATION_COUNT,
  PHASE2_MOVE_COUNT,
  cornerPermutationMoveTable,
  udEdgePermutationMoveTable,
  eSlicePermutationMoveTable,
  ensurePhase2MoveTables,
} from "./phase2MoveTables"

export const PHASE2_CP_ESLICE_SIZE =
  CORNER_PERMUTATION_COUNT *
  ESLICE_PERMUTATION_COUNT

export const PHASE2_UD_ESLICE_SIZE =
  UD_EDGE_PERMUTATION_COUNT *
  ESLICE_PERMUTATION_COUNT

let cpESlicePruningTable:
  Uint8Array | undefined

let udESlicePruningTable:
  Uint8Array | undefined

function buildCPESlicePruningTable(): Uint8Array {
  ensurePhase2MoveTables()

  const table = new Uint8Array(
    PHASE2_CP_ESLICE_SIZE,
  )

  table.fill(255)
  table[0] = 0

  const queue = new Uint32Array(
    PHASE2_CP_ESLICE_SIZE,
  )

  queue[0] = 0

  let head = 0
  let tail = 1

  while (head < tail) {
    const current = queue[head++]
    const distance = table[current]

    const cornerPermutation =
      Math.floor(
        current /
          ESLICE_PERMUTATION_COUNT,
      )

    const eSlice =
      current %
      ESLICE_PERMUTATION_COUNT

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const nextCornerPermutation =
        cornerPermutationMoveTable[
          cornerPermutation *
            PHASE2_MOVE_COUNT +
          move
        ]

      const nextESlice =
        eSlicePermutationMoveTable[
          eSlice *
            PHASE2_MOVE_COUNT +
          move
        ]

      const next =
        nextCornerPermutation *
          ESLICE_PERMUTATION_COUNT +
        nextESlice

      if (table[next] !== 255) {
        continue
      }

      table[next] = distance + 1
      queue[tail++] = next
    }
  }

  return table
}

function buildUDESlicePruningTable(): Uint8Array {
  ensurePhase2MoveTables()

  const table = new Uint8Array(
    PHASE2_UD_ESLICE_SIZE,
  )

  table.fill(255)
  table[0] = 0

  const queue = new Uint32Array(
    PHASE2_UD_ESLICE_SIZE,
  )

  queue[0] = 0

  let head = 0
  let tail = 1

  while (head < tail) {
    const current = queue[head++]
    const distance = table[current]

    const udEdgePermutation =
      Math.floor(
        current /
          ESLICE_PERMUTATION_COUNT,
      )

    const eSlice =
      current %
      ESLICE_PERMUTATION_COUNT

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const nextUDEdgePermutation =
        udEdgePermutationMoveTable[
          udEdgePermutation *
            PHASE2_MOVE_COUNT +
          move
        ]

      const nextESlice =
        eSlicePermutationMoveTable[
          eSlice *
            PHASE2_MOVE_COUNT +
          move
        ]

      const next =
        nextUDEdgePermutation *
          ESLICE_PERMUTATION_COUNT +
        nextESlice

      if (table[next] !== 255) {
        continue
      }

      table[next] = distance + 1
      queue[tail++] = next
    }
  }

  return table
}

export function ensurePhase2PruningTables(): void {
  if (
    cpESlicePruningTable &&
    udESlicePruningTable
  ) {
    return
  }

  cpESlicePruningTable =
    buildCPESlicePruningTable()

  udESlicePruningTable =
    buildUDESlicePruningTable()
}

export function getPhase2CPESliceDistance(
  cornerPermutation: number,
  eSlicePermutation: number,
): number {
  ensurePhase2PruningTables()

  return cpESlicePruningTable![
    cornerPermutation *
      ESLICE_PERMUTATION_COUNT +
    eSlicePermutation
  ]
}

export function getPhase2UDESliceDistance(
  udEdgePermutation: number,
  eSlicePermutation: number,
): number {
  ensurePhase2PruningTables()

  return udESlicePruningTable![
    udEdgePermutation *
      ESLICE_PERMUTATION_COUNT +
    eSlicePermutation
  ]
}

export function getPhase2Distance(
  cornerPermutation: number,
  udEdgePermutation: number,
  eSlicePermutation: number,
): number {
  ensurePhase2PruningTables()

  return Math.max(
    getPhase2CPESliceDistance(
      cornerPermutation,
      eSlicePermutation,
    ),
    getPhase2UDESliceDistance(
      udEdgePermutation,
      eSlicePermutation,
    ),
  )
}