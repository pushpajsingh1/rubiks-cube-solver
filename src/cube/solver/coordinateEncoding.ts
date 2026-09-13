import type { CubeCoordinates } from "./coordinates"

export function encodeCornerOrientation(
  coordinates: CubeCoordinates,
): number {
  let index = 0

  for (let i = 0; i < 7; i++) {
    index = index * 3 + coordinates.cornerOrientation[i]
  }

  return index
}

export function encodeEdgeOrientation(
  coordinates: CubeCoordinates,
): number {
  let index = 0

  for (let i = 0; i < 11; i++) {
    index = index * 2 + coordinates.edgeOrientation[i]
  }

  return index
}

export function encodeESlice(
  coordinates: CubeCoordinates,
): number {
  const slicePieces = new Set([8, 9, 10, 11])
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

  for (let i = 0; i < positions.length; i++) {
    index += choose(positions[i], i + 1)
  }

  return 494 - index
}

export function encodeCornerPermutation(
  coordinates: CubeCoordinates,
): number {
  return rankPermutation(
    coordinates.cornerPermutation,
  )
}

export function encodeUDEdgePermutation(
  coordinates: CubeCoordinates,
): number {
  const values: number[] = []

  for (let position = 0; position < 12; position++) {
    const piece = coordinates.edgePermutation[position]

    if (piece < 8) {
      values.push(piece)
    }
  }

  return rankPermutation(values)
}

export function encodeESlicePermutation(
  coordinates: CubeCoordinates,
): number {
  const values: number[] = []

  for (let position = 0; position < 12; position++) {
    const piece = coordinates.edgePermutation[position]

    if (piece >= 8) {
      values.push(piece - 8)
    }
  }

  return rankPermutation(values)
}

/* ------------------------------------------------------------------ */
/* Decoders                                                           */
/* ------------------------------------------------------------------ */

export function decodeCornerOrientation(
  index: number,
): number[] {
  if (index < 0 || index >= 3 ** 7) {
    throw new Error(
      `Invalid corner orientation index: ${index}`,
    )
  }

  const orientation = Array(8).fill(0)
  let remaining = index

  for (let position = 6; position >= 0; position--) {
    orientation[position] = remaining % 3
    remaining = Math.floor(remaining / 3)
  }

  const sum = orientation
    .slice(0, 7)
    .reduce(
      (total, value) => total + value,
      0,
    )

  orientation[7] =
    (3 - (sum % 3)) % 3

  return orientation
}

export function decodeEdgeOrientation(
  index: number,
): number[] {
  if (index < 0 || index >= 2 ** 11) {
    throw new Error(
      `Invalid edge orientation index: ${index}`,
    )
  }

  const orientation = Array(12).fill(0)
  let remaining = index

  for (let position = 10; position >= 0; position--) {
    orientation[position] =
      remaining % 2

    remaining = Math.floor(
      remaining / 2,
    )
  }

  const sum = orientation
    .slice(0, 11)
    .reduce(
      (total, value) => total + value,
      0,
    )

  orientation[11] = sum % 2

  return orientation
}

export function decodeESliceEdgePermutation(
  index: number,
): number[] {
  if (index < 0 || index > 494) {
    throw new Error(
      `Invalid E-slice index: ${index}`,
    )
  }

  let rank = 494 - index

  const positions = Array(4).fill(0)
  let maximumPosition = 11

  for (let count = 4; count >= 1; count--) {
    let position = maximumPosition

    while (
      choose(position, count) > rank
    ) {
      position--
    }

    positions[count - 1] = position

    rank -= choose(
      position,
      count,
    )

    maximumPosition =
      position - 1
  }

  const eSlicePositions =
    new Set(positions)

  const edgePermutation: number[] = []

  let eSlicePiece = 8
  let otherPiece = 0

  for (
    let position = 0;
    position < 12;
    position++
  ) {
    if (
      eSlicePositions.has(position)
    ) {
      edgePermutation.push(
        eSlicePiece++,
      )
    } else {
      edgePermutation.push(
        otherPiece++,
      )
    }
  }

  return edgePermutation
}

export function decodeCornerPermutation(
  index: number,
): number[] {
  if (index < 0 || index >= factorial(8)) {
    throw new Error(
      `Invalid corner permutation index: ${index}`,
    )
  }

  return unrankPermutation(index, 8)
}

export function decodeUDEdgePermutation(
  index: number,
): number[] {
  if (index < 0 || index >= factorial(8)) {
    throw new Error(
      `Invalid U/D edge permutation index: ${index}`,
    )
  }

  const permutation =
    unrankPermutation(index, 8)

  return [
    ...permutation,
    8,
    9,
    10,
    11,
  ]
}

export function decodeESlicePermutation(
  index: number,
): number[] {
  if (index < 0 || index >= factorial(4)) {
    throw new Error(
      `Invalid E-slice permutation index: ${index}`,
    )
  }

  const permutation =
    unrankPermutation(index, 4)

  return [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    ...permutation.map(
      (value) => value + 8,
    ),
  ]
}

/* ------------------------------------------------------------------ */
/* Permutation ranking helpers                                        */
/* ------------------------------------------------------------------ */

function choose(
  n: number,
  k: number,
): number {
  if (
    k < 0 ||
    k > n
  ) {
    return 0
  }

  if (
    k === 0 ||
    k === n
  ) {
    return 1
  }

  let result = 1

  for (
    let i = 1;
    i <= k;
    i++
  ) {
    result =
      (result * (n - k + i)) / i
  }

  return Math.round(result)
}

function rankPermutation(
  values: number[],
): number {
  let rank = 0

  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    let smaller = 0

    for (
      let j = i + 1;
      j < values.length;
      j++
    ) {
      if (
        values[j] < values[i]
      ) {
        smaller++
      }
    }

    rank +=
      smaller *
      factorial(
        values.length - 1 - i,
      )
  }

  return rank
}

function unrankPermutation(
  rank: number,
  size: number,
): number[] {
  const available = Array.from(
    { length: size },
    (_, index) => index,
  )

  const result: number[] = []

  let remaining = rank

  for (
    let position = 0;
    position < size;
    position++
  ) {
    const blockSize =
      factorial(
        size - 1 - position,
      )

    const selectedIndex =
      Math.floor(
        remaining / blockSize,
      )

    remaining %= blockSize

    result.push(
      available[selectedIndex],
    )

    available.splice(
      selectedIndex,
      1,
    )
  }

  return result
}

function factorial(
  value: number,
): number {
  let result = 1

  for (
    let i = 2;
    i <= value;
    i++
  ) {
    result *= i
  }

  return result
}