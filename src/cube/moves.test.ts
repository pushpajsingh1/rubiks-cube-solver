import { describe, expect, it } from "vitest"
import { createSolvedCube } from "./CubeState"
import {
  moveU,
  moveU2,
  moveUPrime,
  moveR,
  moveR2,
  moveRPrime,
  moveF,
  moveF2,
  moveFPrime,
  moveL,
  moveL2,
  moveLPrime,
  moveD,
  moveD2,
  moveDPrime,
  moveB,
  moveB2,
  moveBPrime,
} from "./moves"

describe("U moves", () => {
  it("U × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveU(cube)
    cube = moveU(cube)
    cube = moveU(cube)
    cube = moveU(cube)

    expect(cube).toEqual(solved)
  })

  it("U followed by U' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveU(cube)
    cube = moveUPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("U2 followed by U2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveU2(cube)
    cube = moveU2(cube)

    expect(cube).toEqual(solved)
  })
})

describe("R moves", () => {
  it("R × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveR(cube)
    cube = moveR(cube)
    cube = moveR(cube)
    cube = moveR(cube)

    expect(cube).toEqual(solved)
  })

  it("R followed by R' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveR(cube)
    cube = moveRPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("R2 followed by R2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveR2(cube)
    cube = moveR2(cube)

    expect(cube).toEqual(solved)
  })
})

describe("F moves", () => {
  it("F × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveF(cube)
    cube = moveF(cube)
    cube = moveF(cube)
    cube = moveF(cube)

    expect(cube).toEqual(solved)
  })

  it("F followed by F' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveF(cube)
    cube = moveFPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("F2 followed by F2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveF2(cube)
    cube = moveF2(cube)

    expect(cube).toEqual(solved)
  })
})
describe("L moves", () => {
  it("L × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveL(cube)
    cube = moveL(cube)
    cube = moveL(cube)
    cube = moveL(cube)

    expect(cube).toEqual(solved)
  })

  it("L followed by L' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveL(cube)
    cube = moveLPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("L2 followed by L2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveL2(cube)
    cube = moveL2(cube)

    expect(cube).toEqual(solved)
  })
})
describe("D moves", () => {
  it("D × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveD(cube)
    cube = moveD(cube)
    cube = moveD(cube)
    cube = moveD(cube)

    expect(cube).toEqual(solved)
  })

  it("D followed by D' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveD(cube)
    cube = moveDPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("D2 followed by D2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveD2(cube)
    cube = moveD2(cube)

    expect(cube).toEqual(solved)
  })
})
describe("B moves", () => {
  it("B × 4 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveB(cube)
    cube = moveB(cube)
    cube = moveB(cube)
    cube = moveB(cube)

    expect(cube).toEqual(solved)
  })

  it("B followed by B' should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveB(cube)
    cube = moveBPrime(cube)

    expect(cube).toEqual(solved)
  })

  it("B2 followed by B2 should return to solved", () => {
    const solved = createSolvedCube()

    let cube = createSolvedCube()

    cube = moveB2(cube)
    cube = moveB2(cube)

    expect(cube).toEqual(solved)
  })
})