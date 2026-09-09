import type { CubeCoordinates } from "./coordinates"

/**
 * Encode corner orientation.
 *
 * Range: 0 .. 3^7 - 1 = 2186
 */
export function encodeCornerOrientation(
  coordinates: CubeCoordinates,
): number {
  let index = 0

  for (let i = 0; i < 7; i++) {
    index = index * 3 + coordinates.cornerOrientation[i]
  }

  return index
}

/**
 * Encode edge orientation.
 *
 * Range: 0 .. 2^11 - 1 = 2047
 */
export function encodeEdgeOrientation(
  coordinates: CubeCoordinates,
): number {
  let index = 0

  for (let i = 0; i < 11; i++) {
    index = index * 2 + coordinates.edgeOrientation[i]
  }

  return index
}

/**
 * Encode the locations of the four E-slice pieces.
 *
 * Range: 0 .. C(12,4)-1 = 494
 */
export function encodeESlice(
  coordinates: CubeCoordinates,
): number {
  const slicePieces = new Set([
    8,
    9,
    10,
    11,
  ])

  const positions: number[] = []

  for (let position = 0; position < 12; position++) {
    if (
      slicePieces.has(
        coordinates.edgePermutation[position],
      )
    ) {
      positions.push(position)
    }
  }

  let index = 0

  for (
    let i = 0;
    i < positions.length;
    i++
  ) {
    index += choose(
      positions[i],
      i + 1,
    )
  }

  /*
   * Reverse the ranking so that the solved
   * E-slice positions [8, 9, 10, 11] map to 0.
   */
  return 494 - index
}

/**
 * Encode the corner permutation.
 *
 * Range: 0 .. 8! - 1 = 40319
 */
export function encodeCornerPermutation(
  coordinates: CubeCoordinates,
): number {
  return rankPermutation(
    coordinates.cornerPermutation,
  )
}

/**
 * Encode the permutation of the eight
 * U/D-layer edges.
 *
 * Range: 0 .. 8! - 1 = 40319
 */
export function encodeUDEdgePermutation(
  coordinates: CubeCoordinates,
): number {
  const values: number[] = []

  for (let position = 0; position < 12; position++) {
    const piece =
      coordinates.edgePermutation[position]

    if (piece < 8) {
      values.push(piece)
    }
  }

  return rankPermutation(values)
}

/**
 * Encode the permutation of the four E-slice edges.
 *
 * Range: 0 .. 4! - 1 = 23
 */
export function encodeESlicePermutation(
  coordinates: CubeCoordinates,
): number {
  const values: number[] = []

  for (let position = 0; position < 12; position++) {
    const piece =
      coordinates.edgePermutation[position]

    if (piece >= 8) {
      values.push(piece - 8)
    }
  }

  return rankPermutation(values)
}

function choose(
  n: number,
  k: number,
): number {
  if (k < 0 || k > n) {
    return 0
  }

  if (k === 0 || k === n) {
    return 1
  }

  let result = 1

  for (let i = 1; i <= k; i++) {
    result =
      (result * (n - k + i)) / i
  }

  return result
}

function rankPermutation(
  values: number[],
): number {
  let rank = 0

  for (let i = 0; i < values.length; i++) {
    let smaller = 0

    for (
      let j = i + 1;
      j < values.length;
      j++
    ) {
      if (values[j] < values[i]) {
        smaller++
      }
    }

    rank +=
      smaller *
      factorial(values.length - 1 - i)
  }

  return rank
}

function factorial(
  value: number,
): number {
  let result = 1

  for (let i = 2; i <= value; i++) {
    result *= i
  }

  return result
}