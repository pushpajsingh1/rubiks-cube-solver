import type { CubeState } from "../CubeState"
import {
  applyMove,
  type Move,
} from "../notation"

export type SolverResult = {
  solved: boolean
  moves: Move[]
}

const SEARCH_MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

const DEFAULT_MAX_DEPTH = 12

const FACES = [
  "U",
  "D",
  "F",
  "B",
  "L",
  "R",
] as const

function isSolved(cube: CubeState): boolean {
  return FACES.every((face) => {
    const stickers = cube[face]
    const center = stickers[4]

    return stickers.every(
      (sticker) => sticker === center,
    )
  })
}

function cubeKey(cube: CubeState): string {
  return [
    ...cube.U,
    ...cube.D,
    ...cube.F,
    ...cube.B,
    ...cube.L,
    ...cube.R,
  ].join("")
}

function moveFace(move: Move): string {
  return move[0]
}

function shouldSkipMove(
  move: Move,
  previousMove?: Move,
): boolean {
  if (!previousMove) {
    return false
  }

  return (
    moveFace(move) ===
    moveFace(previousMove)
  )
}

type SearchNode = {
  cube: CubeState
  path: Move[]
}

function buildForwardSearch(
  start: CubeState,
  depth: number,
): Map<string, Move[]> {
  const states = new Map<string, Move[]>()

  states.set(cubeKey(start), [])

  let frontier: SearchNode[] = [
    {
      cube: start,
      path: [],
    },
  ]

  for (let level = 0; level < depth; level++) {
    const nextFrontier: SearchNode[] = []

    for (const node of frontier) {
      const previousMove =
        node.path[node.path.length - 1]

      for (const move of SEARCH_MOVES) {
        if (
          shouldSkipMove(
            move,
            previousMove,
          )
        ) {
          continue
        }

        const nextCube = applyMove(
          node.cube,
          move,
        )

        const key = cubeKey(nextCube)

        if (states.has(key)) {
          continue
        }

        const path = [
          ...node.path,
          move,
        ]

        states.set(key, path)

        nextFrontier.push({
          cube: nextCube,
          path,
        })
      }
    }

    frontier = nextFrontier
  }

  return states
}

function searchBackward(
  start: CubeState,
  depth: number,
  forward: Map<string, Move[]>,
): Move[] | null {
  const rootKey = cubeKey(start)

  if (forward.has(rootKey)) {
    return forward.get(rootKey) ?? []
  }

  let frontier: SearchNode[] = [
    {
      cube: start,
      path: [],
    },
  ]

  const visited = new Set<string>([
    rootKey,
  ])

  for (let level = 0; level < depth; level++) {
    const nextFrontier: SearchNode[] = []

    for (const node of frontier) {
      const previousMove =
        node.path[node.path.length - 1]

      for (const move of SEARCH_MOVES) {
        if (
          shouldSkipMove(
            move,
            previousMove,
          )
        ) {
          continue
        }

        const nextCube = applyMove(
          node.cube,
          move,
        )

        const key = cubeKey(nextCube)

        if (visited.has(key)) {
          continue
        }

        visited.add(key)

        const path = [
          ...node.path,
          move,
        ]

        const forwardPath =
          forward.get(key)

        if (forwardPath) {
          const backwardPath =
            path
              .slice()
              .reverse()
              .map(inverseMove)

          return [
            ...forwardPath,
            ...backwardPath,
          ]
        }

        nextFrontier.push({
          cube: nextCube,
          path,
        })
      }
    }

    frontier = nextFrontier
  }

  return null
}

function inverseMove(move: Move): Move {
  if (move.endsWith("2")) {
    return move
  }

  if (move.endsWith("'")) {
    return move.slice(0, -1)
  }

  return `${move}'`
}

function verifySolution(
  cube: CubeState,
  solution: Move[],
): boolean {
  let current = cube

  for (const move of solution) {
    current = applyMove(
      current,
      move,
    )
  }

  return isSolved(current)
}

export function solveCube(
  cube: CubeState,
  maxDepth: number = DEFAULT_MAX_DEPTH,
): SolverResult {
  if (isSolved(cube)) {
    return {
      solved: true,
      moves: [],
    }
  }

  /*
   * Bidirectional search.
   *
   * Instead of searching the entire solution tree
   * from the scrambled cube, we search from both
   * ends and look for a meeting point.
   *
   * For example:
   *
   *       scramble
   *          ↓
   *       forward
   *          ↓
   *       meeting point
   *          ↑
   *       backward
   *          ↑
   *       solved cube
   */

  const forwardDepth =
    Math.floor(maxDepth / 2)

  const backwardDepth =
    maxDepth - forwardDepth

  const forward =
    buildForwardSearch(
      cube,
      forwardDepth,
    )

  const solved =
    buildForwardSearch(
      createSolvedState(),
      backwardDepth,
    )

  /*
   * Search from the scrambled side against
   * states reachable from the solved side.
   */
  for (const [
    key,
    forwardPath,
  ] of forward.entries()) {
    const backwardPath =
      solved.get(key)

    if (!backwardPath) {
      continue
    }

    const solution = [
      ...forwardPath,
      ...backwardPath
        .slice()
        .reverse()
        .map(inverseMove),
    ]

    if (
      solution.length <= maxDepth &&
      verifySolution(
        cube,
        solution,
      )
    ) {
      return {
        solved: true,
        moves: solution,
      }
    }
  }

  /*
   * The direct meeting search handles cases where
   * the split is not enough.
   */
  const result =
    searchBackward(
      cube,
      backwardDepth,
      solved,
    )

  if (
    result &&
    result.length <= maxDepth &&
    verifySolution(
      cube,
      result,
    )
  ) {
    return {
      solved: true,
      moves: result,
    }
  }

  return {
    solved: false,
    moves: [],
  }
}

function createSolvedState(): CubeState {
  return {
    U: Array(9).fill("white"),
    D: Array(9).fill("yellow"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
    L: Array(9).fill("orange"),
    R: Array(9).fill("red"),
  }
}