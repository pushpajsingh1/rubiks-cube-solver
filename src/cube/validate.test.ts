import { describe, expect, it } from "vitest"
import { createSolvedCube } from "./CubeState"
import { moveR } from "./moves"
import { validateCube } from "./validate"

describe("Cube validation", () => {
  it("accepts a solved cube", () => {
    const cube = createSolvedCube()

    const result = validateCube(cube)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("accepts a legally moved cube", () => {
    const cube = moveR(createSolvedCube())

    const result = validateCube(cube)

    expect(result.valid).toBe(true)
  })

  it("rejects a cube with an incorrect color count", () => {
    const cube = createSolvedCube()

    cube.U[0] = "red"

    const result = validateCube(cube)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("rejects duplicate center colors", () => {
    const cube = createSolvedCube()

    cube.R[4] = "white"

    const result = validateCube(cube)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      "Each face center must have a different color.",
    )
  })
})