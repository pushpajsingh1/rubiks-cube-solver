import type { CubeColor, CubeState } from "./CubeState"

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

export function validateCube(
  cube: CubeState,
): CubeValidationResult {
  const errors: string[] = []

  // Check that every color appears exactly 9 times.
  const counts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0,
  }

  const faces = ["U", "D", "F", "B", "L", "R"] as const

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

  // Check that the six center stickers have unique colors.
  const centers = faces.map((face) => cube[face][4])
  const uniqueCenters = new Set(centers)

  if (uniqueCenters.size !== 6) {
    errors.push(
      "Each face center must have a different color.",
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}