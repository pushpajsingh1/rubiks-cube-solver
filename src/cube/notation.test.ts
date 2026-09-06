import { describe, expect, it } from "vitest"
import {
  inverseMove,
  inverseSequence,
  isValidMove,
} from "./notation"

describe("Move notation", () => {
  it("recognizes valid moves", () => {
    expect(isValidMove("U")).toBe(true)
    expect(isValidMove("R'")).toBe(true)
    expect(isValidMove("F2")).toBe(true)
    expect(isValidMove("X")).toBe(false)
  })

  it("inverts normal moves", () => {
    expect(inverseMove("U")).toBe("U'")
    expect(inverseMove("R")).toBe("R'")
    expect(inverseMove("F")).toBe("F'")
  })

  it("inverts prime moves", () => {
    expect(inverseMove("U'")).toBe("U")
    expect(inverseMove("R'")).toBe("R")
    expect(inverseMove("F'")).toBe("F")
  })

  it("keeps double moves unchanged", () => {
    expect(inverseMove("U2")).toBe("U2")
    expect(inverseMove("R2")).toBe("R2")
    expect(inverseMove("F2")).toBe("F2")
  })

  it("inverts a complete sequence", () => {
    const scramble = ["R", "U", "R'", "F2", "D"]

    expect(inverseSequence(scramble)).toEqual([
      "D'",
      "F2",
      "R",
      "U'",
      "R'",
    ])
  })

  it("throws for invalid moves", () => {
    expect(() => inverseMove("X")).toThrow(
      "Invalid move: X"
    )
  })
})