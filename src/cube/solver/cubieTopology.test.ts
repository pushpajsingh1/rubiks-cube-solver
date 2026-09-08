import {
  describe,
  expect,
  it,
} from "vitest"

import {
  CORNER_GROUPS,
  EDGE_GROUPS,
  validateTopology,
} from "./cubieTopology"

describe("cubie topology", () => {
  it("should discover 8 corner pieces", () => {
    expect(CORNER_GROUPS).toHaveLength(8)
  })

  it("should discover 12 edge pieces", () => {
    expect(EDGE_GROUPS).toHaveLength(12)
  })

  it("each corner should contain 3 stickers", () => {
    for (const corner of CORNER_GROUPS) {
      expect(corner).toHaveLength(3)
    }
  })

  it("each edge should contain 2 stickers", () => {
    for (const edge of EDGE_GROUPS) {
      expect(edge).toHaveLength(2)
    }
  })

  it("corners should contain 24 unique stickers", () => {
    const result = validateTopology()

    expect(result.cornerStickerCount).toBe(24)
  })

  it("edges should contain 24 unique stickers", () => {
    const result = validateTopology()

    expect(result.edgeStickerCount).toBe(24)
  })
})
