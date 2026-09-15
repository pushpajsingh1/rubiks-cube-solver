import { useMemo, useState } from "react"
import type {
  CubeColor,
  CubeState,
  FaceName,
} from "../CubeState"

export type InputColor =
  | "white"
  | "yellow"
  | "red"
  | "orange"
  | "blue"
  | "green"

export type CubeColorFaces = Record<
  FaceName,
  InputColor[]
>

const FACES: FaceName[] = [
  "U",
  "R",
  "F",
  "D",
  "L",
  "B",
]

const COLORS: InputColor[] = [
  "white",
  "yellow",
  "red",
  "orange",
  "blue",
  "green",
]

const COLOR_TO_FACE: Record<
  InputColor,
  CubeColor
> = {
  white: "white",
  yellow: "yellow",
  red: "red",
  orange: "orange",
  blue: "blue",
  green: "green",
}

const COLOR_LABELS: Record<
  InputColor,
  string
> = {
  white: "White",
  yellow: "Yellow",
  red: "Red",
  orange: "Orange",
  blue: "Blue",
  green: "Green",
}

const CENTER_COLORS: Record<
  FaceName,
  InputColor
> = {
  U: "white",
  R: "red",
  F: "green",
  D: "yellow",
  L: "orange",
  B: "blue",
}

const FACE_LABELS: Record<
  FaceName,
  string
> = {
  U: "Top",
  R: "Right",
  F: "Front",
  D: "Bottom",
  L: "Left",
  B: "Back",
}

export function createSolvedColorFaces(): CubeColorFaces {
  return {
    U: Array(9).fill("white"),
    R: Array(9).fill("red"),
    F: Array(9).fill("green"),
    D: Array(9).fill("yellow"),
    L: Array(9).fill("orange"),
    B: Array(9).fill("blue"),
  }
}

export function colorsToCubeState(
  colors: CubeColorFaces,
): CubeState {
  return {
    U: colors.U.map((color) => COLOR_TO_FACE[color]),
    R: colors.R.map((color) => COLOR_TO_FACE[color]),
    F: colors.F.map((color) => COLOR_TO_FACE[color]),
    D: colors.D.map((color) => COLOR_TO_FACE[color]),
    L: colors.L.map((color) => COLOR_TO_FACE[color]),
    B: colors.B.map((color) => COLOR_TO_FACE[color]),
  }
}

export function validateCubeColors(
  colors: CubeColorFaces,
): string[] {
  const errors: string[] = []

  const counts: Record<InputColor, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0,
  }

  for (const face of FACES) {
    for (const color of colors[face]) {
      counts[color]++
    }
  }

  for (const color of COLORS) {
    if (counts[color] !== 9) {
      errors.push(
        `${COLOR_LABELS[color]} must appear exactly 9 times (found ${counts[color]}).`,
      )
    }
  }

  for (const face of FACES) {
    const expected = CENTER_COLORS[face]
    const actual = colors[face][4]

    if (actual !== expected) {
      errors.push(
        `${face} center must be ${COLOR_LABELS[expected]}.`,
      )
    }
  }

  return errors
}

type Props = {
  onCubeReady: (cube: CubeState) => void
  onCubeChange?: (cube: CubeState) => void
}

export default function CubeColorInput({
  onCubeReady,
  onCubeChange,
}: Props) {
  const [colors, setColors] =
    useState<CubeColorFaces>(
      createSolvedColorFaces,
    )

  const [selectedColor, setSelectedColor] =
    useState<InputColor>("white")

  const [errors, setErrors] = useState<string[]>([])

  const counts = useMemo(() => {
    const result: Record<InputColor, number> = {
      white: 0,
      yellow: 0,
      red: 0,
      orange: 0,
      blue: 0,
      green: 0,
    }

    for (const face of FACES) {
      for (const color of colors[face]) {
        result[color]++
      }
    }

    return result
  }, [colors])

  const validationErrors = useMemo(
    () => validateCubeColors(colors),
    [colors],
  )

  const isValid = validationErrors.length === 0

  function setSticker(
    face: FaceName,
    index: number,
  ) {
    if (index === 4) return

    const nextColors: CubeColorFaces = {
      ...colors,
      [face]: colors[face].map(
        (color, stickerIndex) =>
          stickerIndex === index
            ? selectedColor
            : color,
      ),
    }

    setColors(nextColors)
    setErrors([])

    onCubeChange?.(
      colorsToCubeState(nextColors),
    )
  }

  function reset() {
    const solved = createSolvedColorFaces()

    setColors(solved)
    setErrors([])

    onCubeChange?.(
      colorsToCubeState(solved),
    )
  }

  function solve() {
    const nextErrors =
      validateCubeColors(colors)

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return
    }

    onCubeReady(colorsToCubeState(colors))
  }

  return (
    <section className="cube-input">
      <div className="cube-input-header">
        <div>
          <span className="eyebrow">
            CUSTOM CUBE
          </span>

          <h2>Enter Your Scrambled Cube</h2>

          <p>
            Match every sticker with your physical
            cube. The 3D preview updates instantly
            as you enter the colors.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="cube-reset-button"
        >
          ↻ Reset
        </button>
      </div>

      <div className="cube-hold-tip">
        <div className="cube-hold-icon">🧊</div>

        <div>
          <strong>Hold your physical cube like this</strong>

          <span>
            White center on <b>Top</b> · Green center
            facing <b>Front</b> · Red center on{" "}
            <b>Right</b>
          </span>
        </div>
      </div>

      <div className="custom-editor-layout">
        <div className="custom-editor">
          <div className="editor-heading">
            <div>
              <strong>1. Choose a color</strong>
              <span>
                Then click the stickers that use it.
              </span>
            </div>

            <div className="selected-color-label">
              <span
                className="selected-color-preview"
                data-color={selectedColor}
              />
              {COLOR_LABELS[selectedColor]}
            </div>
          </div>

          <div className="color-picker">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-button ${
                  selectedColor === color
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedColor(color)
                }
              >
                <span
                  className="color-dot"
                  data-color={color}
                />

                <span>
                  {COLOR_LABELS[color]}
                </span>

                <small>
                  {counts[color]}/9
                </small>
              </button>
            ))}
          </div>

          <div className="editor-heading face-heading">
            <div>
              <strong>2. Match the six faces</strong>
              <span>
                Center stickers are fixed automatically.
              </span>
            </div>
          </div>

          <div className="cube-net">
            {FACES.map((face) => (
              <div
                key={face}
                className={`cube-face face-${face}`}
              >
                <div className="face-label">
                  <strong>{face}</strong>
                  <span>{FACE_LABELS[face]}</span>
                </div>

                <div className="sticker-grid">
                  {colors[face].map(
                    (color, index) => (
                      <button
                        key={`${face}-${index}`}
                        type="button"
                        className={`input-sticker ${
                          index === 4
                            ? "center-sticker"
                            : ""
                        }`}
                        data-color={color}
                        disabled={index === 4}
                        aria-label={
                          index === 4
                            ? `${face} center`
                            : `${face} sticker ${index + 1}`
                        }
                        onClick={() =>
                          setSticker(
                            face,
                            index,
                          )
                        }
                      >
                        {index === 4 && (
                          <span>•</span>
                        )}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cube-preview-card">
          <div className="preview-heading">
            <div>
              <span>LIVE PREVIEW</span>
              <strong>Your Cube</strong>
            </div>

            <span className="live-indicator">
              <i />
              LIVE
            </span>
          </div>

          <div className="preview-message">
            Compare this cube with your physical cube
            before solving.
          </div>

          <div className="preview-placeholder">
            <div className="preview-cube-icon">
              🧊
            </div>

            <strong>
              Live 3D preview
            </strong>

            <span>
              The main cube viewer updates as you
              enter each sticker.
            </span>
          </div>

          <div
            className={`cube-status ${
              isValid
                ? "status-valid"
                : "status-warning"
            }`}
          >
            <span>
              {isValid ? "✓" : "!"}
            </span>

            <div>
              <strong>
                {isValid
                  ? "Cube is ready"
                  : "Check your colors"}
              </strong>

              <small>
                {isValid
                  ? "All six colors have 9 stickers."
                  : `${validationErrors.length} correction${
                      validationErrors.length === 1
                        ? ""
                        : "s"
                    } needed.`}
              </small>
            </div>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="cube-errors">
          <strong>
            ⚠️ Correct these before solving
          </strong>

          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="solve-entered-cube"
        onClick={solve}
      >
        🧩 Solve My Cube
        <span>→</span>
      </button>
    </section>
  )
}
