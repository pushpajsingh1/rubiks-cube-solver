import { describe, expect, it } from "vitest"
import { createSolvedCube } from "../CubeState"
import { moveR } from "../moves"
import { solveCube } from "./solver"

describe("Basic cube solver", () => {
  it("should recognize a solved cube", () => {
    const cube = createSolvedCube()

    const result = solveCube(cube)

    expect(result.solved).toBe(true)
    expect(result.moves).toEqual([])
  })

  it("should recognize an unsolved cube", () => {
    let cube = createSolvedCube()

    cube = moveR(cube)

    const result = solveCube(cube)

    expect(result.solved).toBe(false)
  })
})