import type { CubeState, CubeColor } from "../CubeState"

export type CanonicalCube = CubeState

const FACE_ORDER = ["U", "R", "F", "D", "L", "B"] as const

/**
 * The current project already uses a consistent six-face model.
 *
 * The solver uses the same color centers as its canonical reference:
 *
 * U = white
 * D = yellow
 * F = green
 * B = blue
 * L = orange
 * R = red
 *
 * Keeping this conversion explicit means the solver can later
 * be changed independently from the UI representation.
 */
export function toCanonicalCube(
  cube: CubeState,
): CanonicalCube {
  return {
    U: [...cube.U],
    D: [...cube.D],
    F: [...cube.F],
    B: [...cube.B],
    L: [...cube.L],
    R: [...cube.R],
  }
}

export function fromCanonicalCube(
  cube: CanonicalCube,
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

export function canonicalCenters(
  cube: CanonicalCube,
): CubeColor[] {
  return FACE_ORDER.map(
    (face) => cube[face][4],
  )
}

export function isCanonicalSolved(
  cube: CanonicalCube,
): boolean {
  return FACE_ORDER.every((face) => {
    const center = cube[face][4]

    return cube[face].every(
      (sticker) => sticker === center,
    )
  })
}