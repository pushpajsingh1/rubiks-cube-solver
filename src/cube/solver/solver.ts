import type { CubeState } from "../CubeState"

export type SolverResult = {
  solved: boolean
  moves: string[]
}

export function solveCube(cube: CubeState): SolverResult {
  const solved = isSolved(cube)

  return {
    solved,
    moves: [],
  }
}

function isSolved(cube: CubeState): boolean {
  const faces = ["U", "D", "F", "B", "L", "R"] as const

  return faces.every((face) => {
    const stickers = cube[face]

    return stickers.every(
      (sticker) => sticker === stickers[4],
    )
  })
}