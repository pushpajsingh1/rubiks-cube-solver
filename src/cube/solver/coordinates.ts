import type { CubeState, CubeColor } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"

export type CornerName =
  | "URF"
  | "UFL"
  | "ULB"
  | "UBR"
  | "DFR"
  | "DLF"
  | "DBL"
  | "DRB"

export type EdgeName =
  | "UR"
  | "UF"
  | "UL"
  | "UB"
  | "DR"
  | "DF"
  | "DL"
  | "DB"
  | "FR"
  | "FL"
  | "BL"
  | "BR"

export type CubeCoordinates = {
  cornerPermutation: number[]
  cornerOrientation: number[]
  edgePermutation: number[]
  edgeOrientation: number[]
}

export const CORNERS: CornerName[] = [
  "URF",
  "UFL",
  "ULB",
  "UBR",
  "DFR",
  "DLF",
  "DBL",
  "DRB",
]

export const EDGES: EdgeName[] = [
  "UR",
  "UF",
  "UL",
  "UB",
  "DR",
  "DF",
  "DL",
  "DB",
  "FR",
  "FL",
  "BL",
  "BR",
]

const CORNER_COLORS: Record<
  CornerName,
  [CubeColor, CubeColor, CubeColor]
> = {
  URF: ["white", "red", "green"],
  UFL: ["white", "green", "orange"],
  ULB: ["white", "orange", "blue"],
  UBR: ["white", "blue", "red"],
  DFR: ["yellow", "green", "red"],
  DLF: ["yellow", "orange", "green"],
  DBL: ["yellow", "blue", "orange"],
  DRB: ["yellow", "red", "blue"],
}

const EDGE_COLORS: Record<
  EdgeName,
  [CubeColor, CubeColor]
> = {
  UR: ["white", "red"],
  UF: ["white", "green"],
  UL: ["white", "orange"],
  UB: ["white", "blue"],
  DR: ["yellow", "red"],
  DF: ["yellow", "green"],
  DL: ["yellow", "orange"],
  DB: ["yellow", "blue"],
  FR: ["green", "red"],
  FL: ["green", "orange"],
  BL: ["blue", "orange"],
  BR: ["blue", "red"],
}

type Sticker = {
  face: keyof CubeState
  index: number
}

/*
 * Sticker positions follow the same 3x3 face indexing used
 * by the existing cube implementation:
 *
 * 0 1 2
 * 3 4 5
 * 6 7 8
 *
 * These positions are only used to READ the cube.
 */
const CORNER_STICKERS: Record<
  CornerName,
  [Sticker, Sticker, Sticker]
> = {
  URF: [
    { face: "U", index: 8 },
    { face: "R", index: 0 },
    { face: "F", index: 2 },
  ],

  UFL: [
    { face: "U", index: 6 },
    { face: "F", index: 0 },
    { face: "L", index: 2 },
  ],

  ULB: [
    { face: "U", index: 0 },
    { face: "L", index: 0 },
    { face: "B", index: 2 },
  ],

  UBR: [
    { face: "U", index: 2 },
    { face: "B", index: 0 },
    { face: "R", index: 2 },
  ],

  DFR: [
    { face: "D", index: 2 },
    { face: "F", index: 8 },
    { face: "R", index: 6 },
  ],

  DLF: [
    { face: "D", index: 0 },
    { face: "L", index: 8 },
    { face: "F", index: 6 },
  ],

  DBL: [
    { face: "D", index: 6 },
    { face: "B", index: 8 },
    { face: "L", index: 6 },
  ],

  DRB: [
    { face: "D", index: 8 },
    { face: "R", index: 8 },
    { face: "B", index: 6 },
  ],
}

const EDGE_STICKERS: Record<
  EdgeName,
  [Sticker, Sticker]
> = {
  UR: [
    { face: "U", index: 5 },
    { face: "R", index: 1 },
  ],

  UF: [
    { face: "U", index: 7 },
    { face: "F", index: 1 },
  ],

  UL: [
    { face: "U", index: 3 },
    { face: "L", index: 1 },
  ],

  UB: [
    { face: "U", index: 1 },
    { face: "B", index: 1 },
  ],

  DR: [
    { face: "D", index: 5 },
    { face: "R", index: 7 },
  ],

  DF: [
    { face: "D", index: 1 },
    { face: "F", index: 7 },
  ],

  DL: [
    { face: "D", index: 3 },
    { face: "L", index: 7 },
  ],

  DB: [
    { face: "D", index: 7 },
    { face: "B", index: 7 },
  ],

  FR: [
    { face: "F", index: 5 },
    { face: "R", index: 3 },
  ],

  FL: [
    { face: "F", index: 3 },
    { face: "L", index: 5 },
  ],

  BL: [
    { face: "B", index: 5 },
    { face: "L", index: 3 },
  ],

  BR: [
    { face: "B", index: 3 },
    { face: "R", index: 5 },
  ],
}

function getSticker(
  cube: CubeState,
  sticker: Sticker,
): CubeColor {
  return cube[sticker.face][sticker.index]
}

function containsSameColors(
  actual: CubeColor[],
  expected: CubeColor[],
): boolean {
  return expected.every((color) =>
    actual.includes(color),
  )
}

function findCornerPiece(
  colors: CubeColor[],
): number {
  return CORNERS.findIndex((corner) =>
    containsSameColors(
      colors,
      CORNER_COLORS[corner],
    ),
  )
}

function findEdgePiece(
  colors: CubeColor[],
): number {
  return EDGES.findIndex((edge) =>
    containsSameColors(
      colors,
      EDGE_COLORS[edge],
    ),
  )
}

/**
 * Corner orientation:
 *
 * 0 = U/D sticker is in the U/D position
 * 1 = U/D sticker is on the side
 * 2 = U/D sticker is on the other side
 */
function getCornerOrientation(
  colors: CubeColor[],
): number {
  const index = colors.findIndex(
    (color) =>
      color === "white" ||
      color === "yellow",
  )

  if (index === 0) return 0
  if (index === 1) return 1

  return 2
}

/**
 * Edge orientation:
 *
 * For the coordinate system we use:
 *
 * 0 = correctly oriented
 * 1 = flipped
 *
 * U/D edges are oriented according to their
 * U/D sticker. Middle-layer edges are oriented
 * according to their F/B sticker.
 */
function getEdgeOrientation(
  colors: CubeColor[],
): number {
  const first = colors[0]
  const second = colors[1]

  const firstIsUD =
    first === "white" ||
    first === "yellow"

  const secondIsUD =
    second === "white" ||
    second === "yellow"

  if (firstIsUD || secondIsUD) {
    return firstIsUD ? 0 : 1
  }

  const firstIsFB =
    first === "green" ||
    first === "blue"

  return firstIsFB ? 0 : 1
}

export function cubeToCoordinates(
  cube: CubeState,
): CubeCoordinates {
  const cornerPermutation: number[] = []
  const cornerOrientation: number[] = []

  for (const position of CORNERS) {
    const stickers = CORNER_STICKERS[position]

    const colors = stickers.map((sticker) =>
      getSticker(cube, sticker),
    )

    const piece = findCornerPiece(colors)

    if (piece === -1) {
      throw new Error(
        `Invalid corner colors at ${position}: ${colors.join(", ")}`,
      )
    }

    cornerPermutation.push(piece)
    cornerOrientation.push(
      getCornerOrientation(colors),
    )
  }

  const edgePermutation: number[] = []
  const edgeOrientation: number[] = []

  for (const position of EDGES) {
    const stickers = EDGE_STICKERS[position]

    const colors = stickers.map((sticker) =>
      getSticker(cube, sticker),
    )

    const piece = findEdgePiece(colors)

    if (piece === -1) {
      throw new Error(
        `Invalid edge colors at ${position}: ${colors.join(", ")}`,
      )
    }

    edgePermutation.push(piece)
    edgeOrientation.push(
      getEdgeOrientation(colors),
    )
  }

  return {
    cornerPermutation,
    cornerOrientation,
    edgePermutation,
    edgeOrientation,
  }
}

/**
 * Convert coordinates back into a cube.
 *
 * This function is deliberately used only for
 * coordinate round-trip tests at this stage.
 */
export function coordinatesToCube(
  coordinates: CubeCoordinates,
): CubeState {
  const cube = {
    U: Array(9).fill("white") as CubeColor[],
    D: Array(9).fill("yellow") as CubeColor[],
    F: Array(9).fill("green") as CubeColor[],
    B: Array(9).fill("blue") as CubeColor[],
    L: Array(9).fill("orange") as CubeColor[],
    R: Array(9).fill("red") as CubeColor[],
  }

  for (let position = 0; position < 8; position++) {
    const pieceIndex =
      coordinates.cornerPermutation[position]

    const piece = CORNERS[pieceIndex]
    const colors = CORNER_COLORS[piece]
    const stickers = CORNER_STICKERS[
      CORNERS[position]
    ]

    const orientation =
      coordinates.cornerOrientation[position]

    const ordered =
      orientation === 0
        ? colors
        : orientation === 1
          ? [colors[2], colors[0], colors[1]]
          : [colors[1], colors[2], colors[0]]

    stickers.forEach((sticker, index) => {
      cube[sticker.face][sticker.index] =
        ordered[index]
    })
  }

  for (let position = 0; position < 12; position++) {
    const pieceIndex =
      coordinates.edgePermutation[position]

    const piece = EDGES[pieceIndex]
    const colors = EDGE_COLORS[piece]
    const stickers = EDGE_STICKERS[EDGES[position]]

    const orientation =
      coordinates.edgeOrientation[position]

    const ordered =
      orientation === 0
        ? colors
        : [colors[1], colors[0]]

    stickers.forEach((sticker, index) => {
      cube[sticker.face][sticker.index] =
        ordered[index]
    })
  }

  return cube
}

export function applyMovesToCoordinates(
  cube: CubeState,
  moves: Move[],
): CubeCoordinates {
  let current = cube

  for (const move of moves) {
    current = applyMove(current, move)
  }

  return cubeToCoordinates(current)
}