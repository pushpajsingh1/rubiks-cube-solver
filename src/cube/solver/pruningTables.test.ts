import { describe, expect, it } from "vitest"

import {
  applyCoordinateMove,
  SOLVER_MOVES,
  solvedCoordinates,
} from "./moveTables"

import {
  CORNER_ORIENTATION_PRUNING_TABLE,
  CORNER_ORIENTATION_TABLE_SIZE,
  decodePhase1,
  encodePhase1,
  ESLICE_PRUNING_TABLE,
  ESLICE_TABLE_SIZE,
  getCornerOrientationDistance,
  getESliceDistance,
  PHASE1_TABLE_SIZE,
  getPhase1Distance,
  PHASE1_PRUNING_TABLE,
} from "./pruningTables"

describe("corner-orientation pruning table", () => {
  it("assigns distance zero to the solved state", () => {
    expect(
      getCornerOrientationDistance(
        solvedCoordinates(),
      ),
    ).toBe(0)
  })

  it("assigns distance one after an R turn", () => {
    const turned = applyCoordinateMove(
      solvedCoordinates(),
      SOLVER_MOVES.indexOf("R"),
    )

    expect(
      getCornerOrientationDistance(turned),
    ).toBe(1)
  })

  it("reaches every corner-orientation state", () => {
    expect(
      CORNER_ORIENTATION_PRUNING_TABLE.length,
    ).toBe(CORNER_ORIENTATION_TABLE_SIZE)

    expect(
      [...CORNER_ORIENTATION_PRUNING_TABLE]
        .every((distance) => distance >= 0),
    ).toBe(true)
  })
})

describe("E-slice pruning table", () => {
  it("assigns distance zero to the solved state", () => {
    expect(
      getESliceDistance(solvedCoordinates()),
    ).toBe(0)
  })

  it("assigns distance one after an R turn", () => {
    const turned = applyCoordinateMove(
      solvedCoordinates(),
      SOLVER_MOVES.indexOf("R"),
    )

    expect(getESliceDistance(turned)).toBe(1)
  })

  it("reaches every E-slice state", () => {
    expect(ESLICE_PRUNING_TABLE.length).toBe(
      ESLICE_TABLE_SIZE,
    )

    expect(
      [...ESLICE_PRUNING_TABLE].every(
        (distance) => distance >= 0,
      ),
    ).toBe(true)
  })
})

describe("phase-1 coordinate index", () => {
  it("round-trips representative indexes", () => {
    const indexes = [
      0,
      1,
      ESLICE_TABLE_SIZE - 1,
      ESLICE_TABLE_SIZE,
      PHASE1_TABLE_SIZE - 1,
    ]

    for (const index of indexes) {
      expect(
        encodePhase1(decodePhase1(index)),
      ).toBe(index)
    }
  })
})
describe("phase-1 pruning table", () => {
  it("assigns distance zero to the solved state", () => {
    expect(
      getPhase1Distance(solvedCoordinates()),
    ).toBe(0)
  })

  it("assigns distance one after an R turn", () => {
    const turned = applyCoordinateMove(
      solvedCoordinates(),
      SOLVER_MOVES.indexOf("R"),
    )

    expect(getPhase1Distance(turned)).toBe(1)
  })

  it("reaches every phase-1 state", () => {
    expect(PHASE1_PRUNING_TABLE.length).toBe(
      PHASE1_TABLE_SIZE,
    )

    expect(
      [...PHASE1_PRUNING_TABLE].every(
        (distance) => distance >= 0,
      ),
    ).toBe(true)
  })
}) 