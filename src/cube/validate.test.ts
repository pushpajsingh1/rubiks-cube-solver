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
  it("accepts a legal multi-move scramble", () => {
  let cube = createSolvedCube()

  cube = moveR(cube)
  cube = moveR(cube)
  cube = moveR(cube)

  const result = validateCube(cube)

  expect(result.valid).toBe(true)
})
it("rejects a cube with a twisted corner", () => {
  const cube = createSolvedCube()

  const temp = cube.U[8]
  cube.U[8] = cube.R[0]
  cube.R[0] = cube.F[2]
  cube.F[2] = temp

  const result = validateCube(cube)

  expect(result.valid).toBe(false)
  expect(
    result.errors.some((error) =>
      error.includes("corner orientation"),
    ),
  ).toBe(true)
})
it("rejects a cube with a flipped edge", () => {
  const cube = createSolvedCube()

  const temp = cube.U[7]
  cube.U[7] = cube.F[1]
  cube.F[1] = temp

  const result = validateCube(cube)

  expect(result.valid).toBe(false)
  expect(
    result.errors.some((error) =>
      error.includes("edge orientation"),
    ),
  ).toBe(true)
})
it("rejects a cube with invalid permutation parity", () => {
  const cube = createSolvedCube()

  // Swap two complete corner pieces:
  // URF <-> UFL
  const urf = [
    cube.U[8],
    cube.R[0],
    cube.F[2],
  ]

  cube.U[8] = cube.U[6]
  cube.R[0] = cube.F[0]
  cube.F[2] = cube.L[2]

  cube.U[6] = urf[0]
  cube.F[0] = urf[1]
  cube.L[2] = urf[2]

  const result = validateCube(cube)

  expect(result.valid).toBe(false)
  expect(
    result.errors.some((error) =>
      error.includes("permutation parity"),
    ),
  ).toBe(true)
})
})