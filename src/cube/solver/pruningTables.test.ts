import {
  describe,
  expect,
  it,
} from "vitest"

import {
  EDGE_ORIENTATION_PRUNING_TABLE,
  CORNER_ORIENTATION_PRUNING_TABLE,
  ESLICE_PRUNING_TABLE,
  PHASE1_PRUNING_TABLE,
  getEdgeOrientationDistance,
  getCornerOrientationDistance,
  getESliceDistance,
  getPhase1Distance,
} from "./pruningTables"

import {
  EDGE_ORIENTATION_COUNT,
  CORNER_ORIENTATION_COUNT,
  ESLICE_COUNT,
} from "./coordinateMoveTables"

function getMaximumDistance(
  table: Uint8Array,
): number {
  let maximum = 0

  for (const value of table) {
    if (value > maximum) {
      maximum = value
    }
  }

  return maximum
}

describe("pruning tables", () => {
  it("has the expected sizes", () => {
    expect(
      EDGE_ORIENTATION_PRUNING_TABLE.length,
    ).toBe(EDGE_ORIENTATION_COUNT)

    expect(
      CORNER_ORIENTATION_PRUNING_TABLE.length,
    ).toBe(CORNER_ORIENTATION_COUNT)

    expect(
      ESLICE_PRUNING_TABLE.length,
    ).toBe(ESLICE_COUNT)

    expect(
      PHASE1_PRUNING_TABLE.length,
    ).toBe(
      CORNER_ORIENTATION_COUNT *
        ESLICE_COUNT,
    )
  })

  it("has distance zero at the solved coordinate", () => {
    expect(
      getEdgeOrientationDistance(0),
    ).toBe(0)

    expect(
      getCornerOrientationDistance(0),
    ).toBe(0)

    expect(
      getESliceDistance(0),
    ).toBe(0)

    expect(
      getPhase1Distance(0, 0),
    ).toBe(0)
  })

  it("does not contain unreachable states", () => {
    expect(
      EDGE_ORIENTATION_PRUNING_TABLE.includes(
        255,
      ),
    ).toBe(false)

    expect(
      CORNER_ORIENTATION_PRUNING_TABLE.includes(
        255,
      ),
    ).toBe(false)

    expect(
      ESLICE_PRUNING_TABLE.includes(
        255,
      ),
    ).toBe(false)

    expect(
      PHASE1_PRUNING_TABLE.includes(
        255,
      ),
    ).toBe(false)
  })

  it("has reasonable maximum distances", () => {
    expect(
      getMaximumDistance(
        EDGE_ORIENTATION_PRUNING_TABLE,
      ),
    ).toBeGreaterThan(0)

    expect(
      getMaximumDistance(
        CORNER_ORIENTATION_PRUNING_TABLE,
      ),
    ).toBeGreaterThan(0)

    expect(
      getMaximumDistance(
        ESLICE_PRUNING_TABLE,
      ),
    ).toBeGreaterThan(0)

    expect(
      getMaximumDistance(
        PHASE1_PRUNING_TABLE,
      ),
    ).toBeGreaterThan(0)
  })
})