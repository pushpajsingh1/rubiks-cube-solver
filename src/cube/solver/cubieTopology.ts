import type {
  CubeState,
  FaceName,
} from "../CubeState"

import {
  applyMove,
  type Move,
} from "../notation"

type StickerId = number

export type StickerPosition = {
  face: FaceName
  index: number
}

export type CubieGroup = StickerId[]

const FACES: FaceName[] = [
  "U",
  "D",
  "F",
  "B",
  "L",
  "R",
]

const MOVES: Move[] = [
  "U",
  "U'",
  "U2",
  "R",
  "R'",
  "R2",
  "F",
  "F'",
  "F2",
  "L",
  "L'",
  "L2",
  "D",
  "D'",
  "D2",
  "B",
  "B'",
  "B2",
]

export const STICKER_POSITIONS: StickerPosition[] =
  FACES.flatMap((face) =>
    Array.from(
      { length: 9 },
      (_, index) => ({
        face,
        index,
      }),
    ),
  )

function stickerId(
  face: FaceName,
  index: number,
): number {
  return (
    FACES.indexOf(face) * 9 +
    index
  )
}

function createTokenCube(): CubeState {
  return {
    U: Array.from(
      { length: 9 },
      (_, i) =>
        `U${i}` as never,
    ),

    D: Array.from(
      { length: 9 },
      (_, i) =>
        `D${i}` as never,
    ),

    F: Array.from(
      { length: 9 },
      (_, i) =>
        `F${i}` as never,
    ),

    B: Array.from(
      { length: 9 },
      (_, i) =>
        `B${i}` as never,
    ),

    L: Array.from(
      { length: 9 },
      (_, i) =>
        `L${i}` as never,
    ),

    R: Array.from(
      { length: 9 },
      (_, i) =>
        `R${i}` as never,
    ),
  }
}

function tokenToId(
  token: string,
): StickerId {
  const face =
    token[0] as FaceName

  const index =
    Number(token.slice(1))

  return stickerId(
    face,
    index,
  )
}

/*
 * Returns:
 *
 * permutation[source] = destination
 */
function buildMovePermutation(
  move: Move,
): number[] {
  const cube =
    createTokenCube()

  const moved =
    applyMove(
      cube,
      move,
    ) as unknown as Record<
      FaceName,
      string[]
    >

  const permutation =
    Array(54).fill(-1)

  for (
    let faceIndex = 0;
    faceIndex < FACES.length;
    faceIndex++
  ) {
    const face =
      FACES[faceIndex]

    for (
      let index = 0;
      index < 9;
      index++
    ) {
      const destination =
        faceIndex * 9 + index

      const source =
        tokenToId(
          moved[face][index],
        )

      permutation[source] =
        destination
    }
  }

  return permutation
}

const MOVE_PERMUTATIONS =
  MOVES.map(buildMovePermutation)

function moveGroup(
  group: CubieGroup,
  permutation: number[],
): CubieGroup {
  return group
    .map(
      (sticker) =>
        permutation[sticker],
    )
    .sort((a, b) => a - b)
}

function groupKey(
  group: CubieGroup,
): string {
  return [...group]
    .sort((a, b) => a - b)
    .join(",")
}

/*
 * Discover the orbit of a sticker group under
 * every basic cube move.
 *
 * A corner has 3 stickers.
 * An edge has 2 stickers.
 */
function discoverOrbit(
  seed: CubieGroup,
): CubieGroup[] {
  const result: CubieGroup[] = []
  const seen = new Set<string>()

  const queue: CubieGroup[] = [
    [...seed].sort((a, b) => a - b),
  ]

  while (queue.length > 0) {
    const current =
      queue.shift()!

    const key =
      groupKey(current)

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(current)

    for (
      const permutation
      of MOVE_PERMUTATIONS
    ) {
      const next =
        moveGroup(
          current,
          permutation,
        )

      const nextKey =
        groupKey(next)

      if (!seen.has(nextKey)) {
        queue.push(next)
      }
    }
  }

  return result
}

/*
 * These two seeds are known adjacent stickers
 * in the project's face layout:
 *
 * URF corner:
 * U8 + R0 + F2
 *
 * UF edge:
 * U7 + F1
 */
const CORNER_SEED: CubieGroup = [
  stickerId("U", 8),
  stickerId("R", 0),
  stickerId("F", 2),
]

const EDGE_SEED: CubieGroup = [
  stickerId("U", 7),
  stickerId("F", 1),
]

export const CORNER_GROUPS =
  discoverOrbit(
    CORNER_SEED,
  )

export const EDGE_GROUPS =
  discoverOrbit(
    EDGE_SEED,
  )

export function getStickerPosition(
  id: StickerId,
): StickerPosition {
  return STICKER_POSITIONS[id]
}

export function getCornerGroups(): CubieGroup[] {
  return CORNER_GROUPS.map(
    (group) => [...group],
  )
}

export function getEdgeGroups(): CubieGroup[] {
  return EDGE_GROUPS.map(
    (group) => [...group],
  )
}

export function validateTopology(): {
  corners: number
  edges: number
  cornerStickerCount: number
  edgeStickerCount: number
} {
  const cornerStickers =
    new Set<number>()

  for (
    const group
    of CORNER_GROUPS
  ) {
    for (
      const sticker
      of group
    ) {
      cornerStickers.add(
        sticker,
      )
    }
  }

  const edgeStickers =
    new Set<number>()

  for (
    const group
    of EDGE_GROUPS
  ) {
    for (
      const sticker
      of group
    ) {
      edgeStickers.add(
        sticker,
      )
    }
  }

  return {
    corners:
      CORNER_GROUPS.length,

    edges:
      EDGE_GROUPS.length,

    cornerStickerCount:
      cornerStickers.size,

    edgeStickerCount:
      edgeStickers.size,
  }
}