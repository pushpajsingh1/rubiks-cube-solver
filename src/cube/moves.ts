import type { CubeState, CubeColor, Face } from "./CubeState"

function rotateFaceClockwise(face: Face): Face {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ]
}

/*
  Face layout:

  0 1 2
  3 4 5
  6 7 8

  The move implementations below use consistent strip
  orientations for all six faces.
*/

// ==================== U MOVES ====================

export function moveU(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.U = rotateFaceClockwise(cube.U)

  // F -> L -> B -> R -> F
  next.F[0] = cube.L[0]
  next.F[1] = cube.L[1]
  next.F[2] = cube.L[2]

  next.R[0] = cube.F[0]
  next.R[1] = cube.F[1]
  next.R[2] = cube.F[2]

  next.B[0] = cube.R[0]
  next.B[1] = cube.R[1]
  next.B[2] = cube.R[2]

  next.L[0] = cube.B[0]
  next.L[1] = cube.B[1]
  next.L[2] = cube.B[2]

  return next
}

export function moveU2(cube: CubeState): CubeState {
  return moveU(moveU(cube))
}

export function moveUPrime(cube: CubeState): CubeState {
  return moveU(moveU(moveU(cube)))
}

// ==================== D MOVES ====================

export function moveD(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.D = rotateFaceClockwise(cube.D)

  // F -> R -> B -> L -> F
  next.F[6] = cube.R[6]
  next.F[7] = cube.R[7]
  next.F[8] = cube.R[8]

  next.R[6] = cube.B[6]
  next.R[7] = cube.B[7]
  next.R[8] = cube.B[8]

  next.B[6] = cube.L[6]
  next.B[7] = cube.L[7]
  next.B[8] = cube.L[8]

  next.L[6] = cube.F[6]
  next.L[7] = cube.F[7]
  next.L[8] = cube.F[8]

  return next
}

export function moveD2(cube: CubeState): CubeState {
  return moveD(moveD(cube))
}

export function moveDPrime(cube: CubeState): CubeState {
  return moveD(moveD(moveD(cube)))
}

// ==================== F MOVES ====================

export function moveF(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.F = rotateFaceClockwise(cube.F)

  const uBottom = [
    cube.U[6],
    cube.U[7],
    cube.U[8],
  ]

  const rLeft = [
    cube.R[0],
    cube.R[3],
    cube.R[6],
  ]

  const dTop = [
    cube.D[0],
    cube.D[1],
    cube.D[2],
  ]

  const lRight = [
    cube.L[2],
    cube.L[5],
    cube.L[8],
  ]

  // U -> R
  next.R[0] = uBottom[0]
  next.R[3] = uBottom[1]
  next.R[6] = uBottom[2]

  // R -> D
  next.D[0] = rLeft[0]
  next.D[1] = rLeft[1]
  next.D[2] = rLeft[2]

  // D -> L
  next.L[2] = dTop[0]
  next.L[5] = dTop[1]
  next.L[8] = dTop[2]

  // L -> U
  next.U[6] = lRight[0]
  next.U[7] = lRight[1]
  next.U[8] = lRight[2]

  return next
}

export function moveF2(cube: CubeState): CubeState {
  return moveF(moveF(cube))
}

export function moveFPrime(cube: CubeState): CubeState {
  return moveF(moveF(moveF(cube)))
}

// ==================== B MOVES ====================

export function moveB(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.B = rotateFaceClockwise(cube.B)

  const uTop = [
    cube.U[0],
    cube.U[1],
    cube.U[2],
  ]

  const rRight = [
    cube.R[2],
    cube.R[5],
    cube.R[8],
  ]

  const dBottom = [
    cube.D[6],
    cube.D[7],
    cube.D[8],
  ]

  const lLeft = [
    cube.L[0],
    cube.L[3],
    cube.L[6],
  ]

  // U -> L
  next.L[0] = uTop[0]
  next.L[3] = uTop[1]
  next.L[6] = uTop[2]

  // L -> D
  next.D[6] = lLeft[0]
  next.D[7] = lLeft[1]
  next.D[8] = lLeft[2]

  // D -> R
  next.R[2] = dBottom[0]
  next.R[5] = dBottom[1]
  next.R[8] = dBottom[2]

  // R -> U
  next.U[0] = rRight[0]
  next.U[1] = rRight[1]
  next.U[2] = rRight[2]

  return next
}

export function moveB2(cube: CubeState): CubeState {
  return moveB(moveB(cube))
}

export function moveBPrime(cube: CubeState): CubeState {
  return moveB(moveB(moveB(cube)))
}

// ==================== R MOVES ====================

export function moveR(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.R = rotateFaceClockwise(cube.R)

  const uRight = [
    cube.U[2],
    cube.U[5],
    cube.U[8],
  ]

  const fRight = [
    cube.F[2],
    cube.F[5],
    cube.F[8],
  ]

  const dRight = [
    cube.D[2],
    cube.D[5],
    cube.D[8],
  ]

  const bLeft = [
    cube.B[6],
    cube.B[3],
    cube.B[0],
  ]

  // U -> F
  next.F[2] = uRight[0]
  next.F[5] = uRight[1]
  next.F[8] = uRight[2]

  // F -> D
  next.D[2] = fRight[0]
  next.D[5] = fRight[1]
  next.D[8] = fRight[2]

  // D -> B
  next.B[6] = dRight[0]
  next.B[3] = dRight[1]
  next.B[0] = dRight[2]

  // B -> U
  next.U[2] = bLeft[0]
  next.U[5] = bLeft[1]
  next.U[8] = bLeft[2]

  return next
}

export function moveR2(cube: CubeState): CubeState {
  return moveR(moveR(cube))
}

export function moveRPrime(cube: CubeState): CubeState {
  return moveR(moveR(moveR(cube)))
}

// ==================== L MOVES ====================

export function moveL(cube: CubeState): CubeState {
  const next = structuredClone(cube)

  next.L = rotateFaceClockwise(cube.L)

  const uLeft = [
    cube.U[0],
    cube.U[3],
    cube.U[6],
  ]

  const fLeft = [
    cube.F[0],
    cube.F[3],
    cube.F[6],
  ]

  const dLeft = [
    cube.D[0],
    cube.D[3],
    cube.D[6],
  ]

  const bRight = [
    cube.B[8],
    cube.B[5],
    cube.B[2],
  ]

  // U -> B
  next.B[8] = uLeft[0]
  next.B[5] = uLeft[1]
  next.B[2] = uLeft[2]

  // B -> D
  next.D[0] = bRight[0]
  next.D[3] = bRight[1]
  next.D[6] = bRight[2]

  // D -> F
  next.F[0] = dLeft[0]
  next.F[3] = dLeft[1]
  next.F[6] = dLeft[2]

  // F -> U
  next.U[0] = fLeft[0]
  next.U[3] = fLeft[1]
  next.U[6] = fLeft[2]

  return next
}

export function moveL2(cube: CubeState): CubeState {
  return moveL(moveL(cube))
}

export function moveLPrime(cube: CubeState): CubeState {
  return moveL(moveL(moveL(cube)))
}

// ==================== UTILITY ====================

export function applyMove(
  cube: CubeState,
  move: string,
): CubeState {
  switch (move) {
    case "U":
      return moveU(cube)

    case "U'":
      return moveUPrime(cube)

    case "U2":
      return moveU2(cube)

    case "D":
      return moveD(cube)

    case "D'":
      return moveDPrime(cube)

    case "D2":
      return moveD2(cube)

    case "F":
      return moveF(cube)

    case "F'":
      return moveFPrime(cube)

    case "F2":
      return moveF2(cube)

    case "B":
      return moveB(cube)

    case "B'":
      return moveBPrime(cube)

    case "B2":
      return moveB2(cube)

    case "R":
      return moveR(cube)

    case "R'":
      return moveRPrime(cube)

    case "R2":
      return moveR2(cube)

    case "L":
      return moveL(cube)

    case "L'":
      return moveLPrime(cube)

    case "L2":
      return moveL2(cube)

    default:
      return cube
  }
}

export function applyMoves(
  cube: CubeState,
  moves: string[],
): CubeState {
  return moves.reduce(
    (current, move) => applyMove(current, move),
    cube,
  )
}