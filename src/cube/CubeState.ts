export type CubeColor =
  | "white"
  | "yellow"
  | "red"
  | "orange"
  | "blue"
  | "green"

export type FaceName =
  | "U"
  | "D"
  | "F"
  | "B"
  | "L"
  | "R"

export type Face = CubeColor[]

export type CubeState = {
  U: Face
  D: Face
  F: Face
  B: Face
  L: Face
  R: Face
}

export function createSolvedCube(): CubeState {
  return {
    U: Array(9).fill("white"),
    D: Array(9).fill("yellow"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
    L: Array(9).fill("orange"),
    R: Array(9).fill("red"),
  }
}
