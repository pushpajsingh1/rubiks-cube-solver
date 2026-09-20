import type { CubeColor, CubeState } from "./CubeState"
import { cubeToCoordinates } from "./solver/coordinates"

const COLORS: CubeColor[] = [
  "white",
  "yellow",
  "red",
  "orange",
  "blue",
  "green",
]

const EXPECTED_COUNTS = 9

export type CubeValidationResult = {
  valid: boolean
  errors: string[]
}

function isPermutation(values: number[], size: number): boolean {
  if (values.length !== size) {
    return false
  }

  const sorted = [...values].sort((a, b) => a - b)

  return sorted.every((value, index) => value === index)
}

function permutationParity(values: number[]): number {
  let inversions = 0

  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] > values[j]) {
        inversions++
      }
    }
  }

  return inversions % 2
}

export function validateCube(
  cube: CubeState,
): CubeValidationResult {
  const errors: string[] = []

  const counts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0,
  }

  const faces = ["U", "D", "F", "B", "L", "R"] as const

  // --------------------------------------------------
  // 1. Basic face and color validation
  // --------------------------------------------------

  for (const face of faces) {
    if (cube[face].length !== 9) {
      errors.push(
        `${face} face must contain exactly 9 stickers.`,
      )
      continue
    }

    for (const color of cube[face]) {
      if (!COLORS.includes(color)) {
        errors.push(
          `Invalid cube color found: ${color}`,
        )
      } else {
        counts[color]++
      }
    }
  }

  for (const color of COLORS) {
    if (counts[color] !== EXPECTED_COUNTS) {
      errors.push(
        `${color} must appear exactly 9 times, but found ${counts[color]}.`,
      )
    }
  }

  // --------------------------------------------------
  // 2. Center validation
  // --------------------------------------------------

  const centers = faces.map((face) => cube[face][4])
  const uniqueCenters = new Set(centers)

  if (uniqueCenters.size !== 6) {
    errors.push(
      "Each face center must have a different color.",
    )
  }

  // Stop here if the basic sticker data is already invalid.
  // Coordinate conversion cannot safely operate on it.
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    }
  }

  // --------------------------------------------------
  // 3. Convert to cubie coordinates
  // --------------------------------------------------

  let coordinates

  try {
    coordinates = cubeToCoordinates(cube)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Invalid corner or edge configuration."

    errors.push(
      `Invalid cube piece configuration: ${message}`,
    )

    return {
      valid: false,
      errors,
    }
  }

  // --------------------------------------------------
  // 4. Corner permutation
  // --------------------------------------------------

  if (
    !isPermutation(
      coordinates.cornerPermutation,
      8,
    )
  ) {
    errors.push(
      "Invalid corner permutation: every corner piece must appear exactly once.",
    )
  }

  // --------------------------------------------------
  // 5. Edge permutation
  // --------------------------------------------------

  if (
    !isPermutation(
      coordinates.edgePermutation,
      12,
    )
  ) {
    errors.push(
      "Invalid edge permutation: every edge piece must appear exactly once.",
    )
  }

  // --------------------------------------------------
  // 6. Corner orientation
  // --------------------------------------------------

  const cornerOrientationSum =
    coordinates.cornerOrientation.reduce(
      (sum, value) => sum + value,
      0,
    )

  if (cornerOrientationSum % 3 !== 0) {
    errors.push(
      "Invalid corner orientation: the total corner twist must be divisible by 3.",
    )
  }

  // --------------------------------------------------
  // 7. Edge orientation
  // --------------------------------------------------

  const edgeOrientationSum =
    coordinates.edgeOrientation.reduce(
      (sum, value) => sum + value,
      0,
    )

  if (edgeOrientationSum % 2 !== 0) {
    errors.push(
      "Invalid edge orientation: the total edge flip must be even.",
    )
  }

  // --------------------------------------------------
  // 8. Permutation parity
  // --------------------------------------------------

  if (
    isPermutation(
      coordinates.cornerPermutation,
      8,
    ) &&
    isPermutation(
      coordinates.edgePermutation,
      12,
    )
  ) {
    const cornerParity = permutationParity(
      coordinates.cornerPermutation,
    )

    const edgeParity = permutationParity(
      coordinates.edgePermutation,
    )

    if (cornerParity !== edgeParity) {
      errors.push(
        "Invalid cube permutation parity: corner and edge permutations must have the same parity.",
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}