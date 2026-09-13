import type { CubeState } from "../CubeState"
import type { Move } from "../notation"
import {
  cubeToCoordinates,
} from "./coordinates"
import {
  encodeCornerPermutation,
  encodeUDEdgePermutation,
  encodeESlicePermutation,
} from "./coordinateEncoding"
import {
  PHASE2_MOVES,
} from "./phase2Moves"
import {
  getPhase2Distance,
} from "./phase2PruningTables"
import {
  cornerPermutationMoveTable,
  udEdgePermutationMoveTable,
  eSlicePermutationMoveTable,
  PHASE2_MOVE_COUNT,
  ensurePhase2MoveTables,
} from "./phase2MoveTables"

export type Phase2State = {
  cornerPermutation: number
  udEdgePermutation: number
  eSlicePermutation: number
}

export type Phase2Result = {
  found: boolean
  moves: Move[]
  depth: number
}

const MAX_PHASE2_DEPTH = 20

function createPhase2State(
  cube: CubeState,
): Phase2State {
  const coordinates =
    cubeToCoordinates(cube)

  return {
    cornerPermutation:
      encodeCornerPermutation(
        coordinates,
      ),

    udEdgePermutation:
      encodeUDEdgePermutation(
        coordinates,
      ),

    eSlicePermutation:
      encodeESlicePermutation(
        coordinates,
      ),
  }
}

function isSolved(
  state: Phase2State,
): boolean {
  return (
    state.cornerPermutation === 0 &&
    state.udEdgePermutation === 0 &&
    state.eSlicePermutation === 0
  )
}

function moveFace(move: Move): string {
  return move[0]
}

function inverseMove(move: Move): Move {
  if (move.endsWith("2")) {
    return move
  }

  if (move.endsWith("'")) {
    return move.slice(0, -1) as Move
  }

  return `${move}'` as Move
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

function applyPhase2Move(
  state: Phase2State,
  moveIndex: number,
): Phase2State {
  return {
    cornerPermutation:
      cornerPermutationMoveTable[
        state.cornerPermutation *
          PHASE2_MOVE_COUNT +
        moveIndex
      ],

    udEdgePermutation:
      udEdgePermutationMoveTable[
        state.udEdgePermutation *
          PHASE2_MOVE_COUNT +
        moveIndex
      ],

    eSlicePermutation:
      eSlicePermutationMoveTable[
        state.eSlicePermutation *
          PHASE2_MOVE_COUNT +
        moveIndex
      ],
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
  state: Phase2State,
  depth: number,
  bound: number,
  path: Move[],
): SearchResult {
  const heuristic =
    getPhase2Distance(
      state.cornerPermutation,
      state.udEdgePermutation,
      state.eSlicePermutation,
    )

  const f = depth + heuristic

  if (f > bound) {
    return {
      found: false,
      nextBound: f,
    }
  }

  if (isSolved(state)) {
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
    moveIndex < PHASE2_MOVES.length;
    moveIndex++
  ) {
    const move =
      PHASE2_MOVES[moveIndex]

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
      move === inverseMove(
        previousMove,
      )
    ) {
      continue
    }

    const nextState =
      applyPhase2Move(
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

export function solvePhase2(
  cube: CubeState,
  maxDepth: number = MAX_PHASE2_DEPTH,
): Phase2Result {
  ensurePhase2MoveTables()

  const start =
    createPhase2State(cube)

  if (isSolved(start)) {
    return {
      found: true,
      moves: [],
      depth: 0,
    }
  }

  let bound =
    getPhase2Distance(
      start.cornerPermutation,
      start.udEdgePermutation,
      start.eSlicePermutation,
    )

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