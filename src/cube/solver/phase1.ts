import type { CubeState } from "../CubeState"
import {
  cubeToCoordinates,
  type CubeCoordinates,
} from "./coordinates"
import {
  SOLVER_MOVES,
} from "./moveTables"
import {
  nextCornerOrientation,
  nextEdgeOrientation,
  nextESlice,
} from "./coordinateMoveTables"
import {
  getCornerOrientationDistance,
  getEdgeOrientationDistance,
  getPhase1Distance,
} from "./pruningTables"
import {
  encodeCornerOrientation,
  encodeEdgeOrientation,
  encodeESlice,
} from "./coordinateEncoding"
import type { Move } from "../notation"

export type Phase1State = {
  cornerOrientation: number
  edgeOrientation: number
  eSlice: number
}

export type Phase1Result = {
  found: boolean
  moves: Move[]
  depth: number
}

const MAX_PHASE1_DEPTH = 12

function createPhase1State(
  coordinates: CubeCoordinates,
): Phase1State {
  return {
    cornerOrientation:
      encodeCornerOrientation(
        coordinates,
      ),
    edgeOrientation:
      encodeEdgeOrientation(
        coordinates,
      ),
    eSlice:
      encodeESlice(coordinates),
  }
}

function isPhase1Solved(
  state: Phase1State,
): boolean {
  return (
    state.cornerOrientation === 0 &&
    state.edgeOrientation === 0 &&
    state.eSlice === 0
  )
}

function heuristic(
  state: Phase1State,
): number {
  return Math.max(
    getCornerOrientationDistance(
      state.cornerOrientation,
    ),
    getEdgeOrientationDistance(
      state.edgeOrientation,
    ),
    getPhase1Distance(
      state.cornerOrientation,
      state.eSlice,
    ),
  )
}

function inverseMove(
  move: Move,
): Move {
  if (move.endsWith("2")) {
    return move
  }

  if (move.endsWith("'")) {
    return move.slice(0, -1) as Move
  }

  return `${move}'` as Move
}

function moveFace(
  move: Move,
): string {
  return move[0]
}

function shouldSkipMove(
  move: Move,
  previousMove?: Move,
): boolean {
  if (!previousMove) {
    return false
  }

  const currentFace =
    moveFace(move)

  const previousFace =
    moveFace(previousMove)

  if (
    currentFace === previousFace
  ) {
    return true
  }

  if (
    (currentFace === "U" &&
      previousFace === "D") ||
    (currentFace === "D" &&
      previousFace === "U")
  ) {
    return currentFace < previousFace
  }

  if (
    (currentFace === "F" &&
      previousFace === "B") ||
    (currentFace === "B" &&
      previousFace === "F")
  ) {
    return currentFace < previousFace
  }

  if (
    (currentFace === "L" &&
      previousFace === "R") ||
    (currentFace === "R" &&
      previousFace === "L")
  ) {
    return currentFace < previousFace
  }

  return false
}

function applyPhase1Move(
  state: Phase1State,
  moveIndex: number,
): Phase1State {
  return {
    cornerOrientation:
      nextCornerOrientation(
        state.cornerOrientation,
        moveIndex,
      ),

    edgeOrientation:
      nextEdgeOrientation(
        state.edgeOrientation,
        moveIndex,
      ),

    eSlice:
      nextESlice(
        state.eSlice,
        moveIndex,
      ),
  }
}

type SearchResult =
  | {
      found: true
      path: Move[]
    }
  | {
      found: false
      nextBound: number
    }

function search(
  state: Phase1State,
  depth: number,
  bound: number,
  path: Move[],
): SearchResult {
  const h = heuristic(state)
  const f = depth + h

  if (f > bound) {
    return {
      found: false,
      nextBound: f,
    }
  }

  if (isPhase1Solved(state)) {
    return {
      found: true,
      path,
    }
  }

  let nextBound =
    Number.POSITIVE_INFINITY

  const previousMove =
    path[path.length - 1]

  for (
    let moveIndex = 0;
    moveIndex < SOLVER_MOVES.length;
    moveIndex++
  ) {
    const move =
      SOLVER_MOVES[moveIndex]

    if (
      shouldSkipMove(
        move,
        previousMove,
      )
    ) {
      continue
    }

    if (
      previousMove &&
      move === inverseMove(previousMove)
    ) {
      continue
    }

    const nextState =
      applyPhase1Move(
        state,
        moveIndex,
      )

    const result = search(
      nextState,
      depth + 1,
      bound,
      [...path, move],
    )

    if (result.found) {
      return result
    }

    nextBound = Math.min(
      nextBound,
      result.nextBound,
    )
  }

  return {
    found: false,
    nextBound,
  }
}

export function solvePhase1(
  cube: CubeState,
  maxDepth: number = MAX_PHASE1_DEPTH,
): Phase1Result {
  const coordinates =
    cubeToCoordinates(cube)

  const start =
    createPhase1State(coordinates)

  if (isPhase1Solved(start)) {
    return {
      found: true,
      moves: [],
      depth: 0,
    }
  }

  let bound = heuristic(start)

  while (bound <= maxDepth) {
    const result = search(
      start,
      0,
      bound,
      [],
    )

    if (result.found) {
      return {
        found: true,
        moves: result.path,
        depth: result.path.length,
      }
    }

    if (
      result.nextBound ===
      Number.POSITIVE_INFINITY
    ) {
      break
    }

    bound = result.nextBound
  }

  return {
    found: false,
    moves: [],
    depth: -1,
  }
}