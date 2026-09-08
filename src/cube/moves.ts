import type {
  CubeState,
  Face,
  FaceName,
} from "./CubeState"

export type BasicFaceMove =
  | "U"
  | "R"
  | "F"
  | "L"
  | "D"
  | "B"

export type Move =
  | BasicFaceMove
  | `${BasicFaceMove}'`
  | `${BasicFaceMove}2`

type Vec3 = {
  x: number
  y: number
  z: number
}

type Facelet = {
  face: FaceName
  index: number
  position: Vec3
  normal: Vec3
}

const FACES: FaceName[] = [
  "U",
  "D",
  "F",
  "B",
  "L",
  "R",
]

const FACE_NORMALS: Record<
  FaceName,
  Vec3
> = {
  U: { x: 0, y: 1, z: 0 },
  D: { x: 0, y: -1, z: 0 },
  F: { x: 0, y: 0, z: 1 },
  B: { x: 0, y: 0, z: -1 },
  L: { x: -1, y: 0, z: 0 },
  R: { x: 1, y: 0, z: 0 },
}

/*
 * For every face:
 *
 * index:
 *
 * 0 1 2
 * 3 4 5
 * 6 7 8
 *
 * `right` describes the direction from the left
 * side of the face to the right side.
 *
 * `down` describes the direction from the top
 * of the face to the bottom.
 */
const FACE_BASIS: Record<
  FaceName,
  {
    right: Vec3
    down: Vec3
  }
> = {
  U: {
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: 0, z: 1 },
  },

  D: {
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: 0, z: -1 },
  },

  F: {
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: -1, z: 0 },
  },

  B: {
    right: { x: -1, y: 0, z: 0 },
    down: { x: 0, y: -1, z: 0 },
  },

  L: {
    right: { x: 0, y: 0, z: 1 },
    down: { x: 0, y: -1, z: 0 },
  },

  R: {
    right: { x: 0, y: 0, z: -1 },
    down: { x: 0, y: -1, z: 0 },
  },
}

function add(
  a: Vec3,
  b: Vec3,
): Vec3 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}

function multiply(
  vector: Vec3,
  scalar: number,
): Vec3 {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
    z: vector.z * scalar,
  }
}

function rotateVector(
  vector: Vec3,
  axis: Vec3,
): Vec3 {
  /*
   * Rotation by -90° around the axis.
   *
   * For a unit axis and a cube-aligned vector:
   *
   * v' = axis × v + axis(axis · v)
   *
   * with the perpendicular component rotated clockwise.
   */
  const cross = {
    x:
      axis.y * vector.z -
      axis.z * vector.y,

    y:
      axis.z * vector.x -
      axis.x * vector.z,

    z:
      axis.x * vector.y -
      axis.y * vector.x,
  }

  const dot =
    axis.x * vector.x +
    axis.y * vector.y +
    axis.z * vector.z

  return {
    x: -cross.x + axis.x * dot,
    y: -cross.y + axis.y * dot,
    z: -cross.z + axis.z * dot,
  }
}

function sameVector(
  a: Vec3,
  b: Vec3,
): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.z === b.z
  )
}

function createFacelets(): Facelet[] {
  const facelets: Facelet[] = []

  for (const face of FACES) {
    const normal =
      FACE_NORMALS[face]

    const basis =
      FACE_BASIS[face]

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const horizontal =
          multiply(
            basis.right,
            col - 1,
          )

        const vertical =
          multiply(
            basis.down,
            row - 1,
          )

        const position =
          add(
            add(normal, horizontal),
            vertical,
          )

        facelets.push({
          face,
          index: row * 3 + col,
          position,
          normal,
        })
      }
    }
  }

  return facelets
}

const FACELETS =
  createFacelets()

function faceFromVector(
  normal: Vec3,
): FaceName {
  for (const face of FACES) {
    if (
      sameVector(
        FACE_NORMALS[face],
        normal,
      )
    ) {
      return face
    }
  }

  throw new Error(
    `Unknown face normal: ${JSON.stringify(normal)}`,
  )
}

function indexFromPosition(
  face: FaceName,
  position: Vec3,
): number {
  const basis =
    FACE_BASIS[face]

  const normal =
    FACE_NORMALS[face]

  const relative = {
    x: position.x - normal.x,
    y: position.y - normal.y,
    z: position.z - normal.z,
  }

  const col =
    relative.x * basis.right.x +
    relative.y * basis.right.y +
    relative.z * basis.right.z +
    1

  const row =
    relative.x * basis.down.x +
    relative.y * basis.down.y +
    relative.z * basis.down.z +
    1

  if (
    !Number.isInteger(row) ||
    !Number.isInteger(col) ||
    row < 0 ||
    row > 2 ||
    col < 0 ||
    col > 2
  ) {
    throw new Error(
      `Invalid facelet position on ${face}`,
    )
  }

  return row * 3 + col
}

function rotateFacelet(
  facelet: Facelet,
  face: BasicFaceMove,
): Facelet {
  const axis =
    FACE_NORMALS[face]

  const layer =
    axis.x !== 0
      ? facelet.position.x
      : axis.y !== 0
        ? facelet.position.y
        : facelet.position.z

  const target =
    axis.x !== 0
      ? axis.x
      : axis.y !== 0
        ? axis.y
        : axis.z

  if (layer !== target) {
    return facelet
  }

  const position =
    rotateVector(
      facelet.position,
      axis,
    )

  const normal =
    rotateVector(
      facelet.normal,
      axis,
    )

  const newFace =
    faceFromVector(normal)

  const newIndex =
    indexFromPosition(
      newFace,
      position,
    )

  return {
    face: newFace,
    index: newIndex,
    position,
    normal,
  }
}

type Permutation = number[]

function createPermutation(
  face: BasicFaceMove,
): Permutation {
  const permutation =
    Array(54).fill(-1)

  for (
    let sourceIndex = 0;
    sourceIndex < FACELETS.length;
    sourceIndex++
  ) {
    const source =
      FACELETS[sourceIndex]

    const destination =
      rotateFacelet(
        source,
        face,
      )

    const destinationFace =
      FACES.indexOf(
        destination.face,
      )

    const destinationIndex =
      destinationFace * 9 +
      destination.index

    permutation[sourceIndex] =
      destinationIndex
  }

  return permutation
}

const PERMUTATIONS: Record<
  BasicFaceMove,
  Permutation
> = {
  U: createPermutation("U"),
  R: createPermutation("R"),
  F: createPermutation("F"),
  L: createPermutation("L"),
  D: createPermutation("D"),
  B: createPermutation("B"),
}

function flattenCube(
  cube: CubeState,
): Face[] {
  return FACES.map(
    (face) => cube[face],
  )
}

function cloneCube(
  cube: CubeState,
): CubeState {
  return {
    U: [...cube.U],
    D: [...cube.D],
    F: [...cube.F],
    B: [...cube.B],
    L: [...cube.L],
    R: [...cube.R],
  }
}

function applyQuarterTurn(
  cube: CubeState,
  face: BasicFaceMove,
): CubeState {
  const result =
    cloneCube(cube)

  const source =
    flattenCube(cube).flat()

  const permutation =
    PERMUTATIONS[face]

  for (
    let sourceIndex = 0;
    sourceIndex < 54;
    sourceIndex++
  ) {
    const destination =
      permutation[sourceIndex]

    const destinationFace =
      FACES[
        Math.floor(
          destination / 9,
        )
      ]

    const destinationIndex =
      destination % 9

    result[destinationFace][
      destinationIndex
    ] = source[sourceIndex]
  }

  return result
}

export function moveU(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "U")
}

export function moveR(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "R")
}

export function moveF(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "F")
}

export function moveL(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "L")
}

export function moveD(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "D")
}

export function moveB(
  cube: CubeState,
): CubeState {
  return applyQuarterTurn(cube, "B")
}

function applyTimes(
  cube: CubeState,
  face: BasicFaceMove,
  times: number,
): CubeState {
  let result = cube

  for (let i = 0; i < times; i++) {
    result =
      applyQuarterTurn(
        result,
        face,
      )
  }

  return result
}

export function moveU2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "U", 2)
}

export function moveR2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "R", 2)
}

export function moveF2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "F", 2)
}

export function moveL2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "L", 2)
}

export function moveD2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "D", 2)
}

export function moveB2(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "B", 2)
}

export function moveUPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "U", 3)
}

export function moveRPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "R", 3)
}

export function moveFPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "F", 3)
}

export function moveLPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "L", 3)
}

export function moveDPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "D", 3)
}

export function moveBPrime(
  cube: CubeState,
): CubeState {
  return applyTimes(cube, "B", 3)
}

export function applyMove(
  cube: CubeState,
  move: Move,
): CubeState {
  switch (move) {
    case "U":
      return moveU(cube)

    case "U2":
      return moveU2(cube)

    case "U'":
      return moveUPrime(cube)

    case "R":
      return moveR(cube)

    case "R2":
      return moveR2(cube)

    case "R'":
      return moveRPrime(cube)

    case "F":
      return moveF(cube)

    case "F2":
      return moveF2(cube)

    case "F'":
      return moveFPrime(cube)

    case "L":
      return moveL(cube)

    case "L2":
      return moveL2(cube)

    case "L'":
      return moveLPrime(cube)

    case "D":
      return moveD(cube)

    case "D2":
      return moveD2(cube)

    case "D'":
      return moveDPrime(cube)

    case "B":
      return moveB(cube)

    case "B2":
      return moveB2(cube)

    case "B'":
      return moveBPrime(cube)

    default:
      return cube
  }
}