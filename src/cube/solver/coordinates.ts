import type {
  CubeColor,
  CubeState,
  FaceName,
} from "../CubeState"

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

type Sticker = {
  face: FaceName
  index: number
}

/*
 * IMPORTANT
 *
 * These positions match the cube layout used by this project.
 *
 * Face:
 *
 *  0 1 2
 *  3 4 5
 *  6 7 8
 *
 * The coordinate layer deliberately keeps this mapping isolated
 * from the UI and move implementation.
 */

const CORNER_POSITIONS: Record<
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

const EDGE_POSITIONS: Record<
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
  CubeColor[]
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
  CubeColor[]
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

function getSticker(
  cube: CubeState,
  sticker: Sticker,
): CubeColor {
  return cube[sticker.face][sticker.index]
}

function sameColors(
  actual: CubeColor[],
  expected: CubeColor[],
): boolean {
  if (actual.length !== expected.length) {
    return false
  }

  const a = [...actual].sort()
  const b = [...expected].sort()

  return a.every(
    (value, index) => value === b[index],
  )
}

function findCorner(
  colors: CubeColor[],
): number {
  for (let i = 0; i < CORNERS.length; i++) {
    if (
      sameColors(
        colors,
        CORNER_COLORS[CORNERS[i]],
      )
    ) {
      return i
    }
  }

  return -1
}

function findEdge(
  colors: CubeColor[],
): number {
  for (let i = 0; i < EDGES.length; i++) {
    if (
      sameColors(
        colors,
        EDGE_COLORS[EDGES[i]],
      )
    ) {
      return i
    }
  }

  return -1
}

/*
 * Corner orientation.
 *
 * 0 = white/yellow sticker is on the U/D position
 * 1 = twisted once
 * 2 = twisted twice
 *
 * We keep the calculation local to this coordinate layer.
 */
function getCornerOrientation(
  colors: CubeColor[],
): number {
  const udIndex = colors.findIndex(
    (color) =>
      color === "white" ||
      color === "yellow",
  )

  if (udIndex === 0) {
    return 0
  }

  if (udIndex === 1) {
    return 1
  }

  return 2
}

/*
 * Edge orientation.
 *
 * The first coordinate slot is the U/D sticker
 * for U/D-layer edges.
 */
function getEdgeOrientation(
  colors: CubeColor[],
): number {
  if (
    colors[0] === "white" ||
    colors[0] === "yellow"
  ) {
    return 0
  }

  if (
    colors[1] === "white" ||
    colors[1] === "yellow"
  ) {
    return 1
  }

  if (
    colors[0] === "green" ||
    colors[0] === "blue"
  ) {
    return 0
  }

  return 1
}

export function cubeToCoordinates(
  cube: CubeState,
): CubeCoordinates {
  const cornerPermutation: number[] = []
  const cornerOrientation: number[] = []

  const edgePermutation: number[] = []
  const edgeOrientation: number[] = []

  for (const position of CORNERS) {
    const colors =
      CORNER_POSITIONS[position].map(
        (sticker) =>
          getSticker(cube, sticker),
      )

    const piece = findCorner(colors)

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

  for (const position of EDGES) {
    const colors =
      EDGE_POSITIONS[position].map(
        (sticker) =>
          getSticker(cube, sticker),
      )

    const piece = findEdge(colors)

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

/*
 * Reconstruct a cube from coordinates.
 *
 * This is intentionally implemented using the coordinate
 * positions rather than applying moves backwards.
 */
export function coordinatesToCube(
  coordinates: CubeCoordinates,
): CubeState {
  const cube: CubeState = {
    U: Array(9).fill("white"),
    D: Array(9).fill("yellow"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
    L: Array(9).fill("orange"),
    R: Array(9).fill("red"),
  }

  for (let positionIndex = 0; positionIndex < CORNERS.length; positionIndex++) {
    const pieceIndex =
      coordinates.cornerPermutation[positionIndex]

    const position =
      CORNERS[positionIndex]

    const colors =
      CORNER_COLORS[
        CORNERS[pieceIndex]
      ]

    const orientation =
      coordinates.cornerOrientation[positionIndex] % 3

    const rotated = rotateArray(
      colors,
      orientation,
    )

    const stickers =
      CORNER_POSITIONS[position]

    for (let i = 0; i < 3; i++) {
      cube[stickers[i].face][stickers[i].index] =
        rotated[i]
    }
  }

  for (let positionIndex = 0; positionIndex < EDGES.length; positionIndex++) {
    const pieceIndex =
      coordinates.edgePermutation[positionIndex]

    const position =
      EDGES[positionIndex]

    const colors =
      EDGE_COLORS[
        EDGES[pieceIndex]
      ]

    const orientation =
      coordinates.edgeOrientation[positionIndex] % 2

    const rotated =
      orientation === 0
        ? colors
        : [colors[1], colors[0]]

    const stickers =
      EDGE_POSITIONS[position]

    for (let i = 0; i < 2; i++) {
      cube[stickers[i].face][stickers[i].index] =
        rotated[i]
    }
  }

  return cube
}

function rotateArray<T>(
  values: T[],
  amount: number,
): T[] {
  const result = [...values]

  for (let i = 0; i < amount; i++) {
    result.push(result.shift()!)
  }

  return result
}

export function applyMovesToCoordinates(
  cube: CubeState,
  moves: Move[],
): CubeCoordinates {
  let current = cube

  for (const move of moves) {
    current = applyMove(
      current,
      move,
    )
  }

  return cubeToCoordinates(current)
}