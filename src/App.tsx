import { useState } from "react"
import type { CubeColor, CubeState, FaceName } from "./cube/CubeState"
import {
  moveU,
  moveUPrime,
  moveU2,
  moveR,
  moveRPrime,
  moveR2,
  moveF,
  moveFPrime,
  moveF2,
  moveL,
  moveLPrime,
  moveL2,
  moveD,
  moveDPrime,
  moveD2,
  moveB,
  moveBPrime,
  moveB2,
} from "./cube/moves"
import { createSolvedCube } from "./cube/CubeState"
import "./App.css"

type MoveFunction = (cube: CubeState) => CubeState

const moves: Record<string, MoveFunction> = {
  U: moveU,
  "U'": moveUPrime,
  U2: moveU2,

  R: moveR,
  "R'": moveRPrime,
  R2: moveR2,

  F: moveF,
  "F'": moveFPrime,
  F2: moveF2,

  L: moveL,
  "L'": moveLPrime,
  L2: moveL2,

  D: moveD,
  "D'": moveDPrime,
  D2: moveD2,

  B: moveB,
  "B'": moveBPrime,
  B2: moveB2,
}

const faceOrder: FaceName[] = ["U", "L", "F", "R", "B", "D"]

const moveNames = [
  "U",
  "U'",
  "U2",
  "R",
  "R'",
  "R2",
  "F",
  "F'",
  "F2",
  "L",
  "L'",
  "L2",
  "D",
  "D'",
  "D2",
  "B",
  "B'",
  "B2",
]

function getColorClass(color: CubeColor) {
  return `sticker sticker-${color}`
}

function CubeFace({
  name,
  face,
}: {
  name: FaceName
  face: CubeColor[]
}) {
  return (
    <div className="cube-face-container">
      <div className="face-name">{name}</div>

      <div className="cube-face">
        {face.map((color, index) => (
          <div
            key={index}
            className={getColorClass(color)}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  const [cube, setCube] = useState<CubeState>(
    createSolvedCube()
  )

  const [moveHistory, setMoveHistory] = useState<string[]>([])

  function applyMove(move: string) {
    const moveFunction = moves[move]

    if (!moveFunction) return

    setCube((currentCube) => moveFunction(currentCube))

    setMoveHistory((history) => [...history, move])
  }

  function undoMove() {
    if (moveHistory.length === 0) return

    const lastMove =
      moveHistory[moveHistory.length - 1]

    const inverseMove =
      lastMove.endsWith("'")
        ? lastMove.replace("'", "")
        : lastMove.endsWith("2")
          ? lastMove
          : `${lastMove}'`

    const moveFunction = moves[inverseMove]

    if (!moveFunction) return

    setCube((currentCube) =>
      moveFunction(currentCube)
    )

    setMoveHistory((history) =>
      history.slice(0, -1)
    )
  }

  function scrambleCube() {
    let scrambledCube = createSolvedCube()
    const scramble: string[] = []

    let previousFace = ""

    for (let i = 0; i < 20; i++) {
      let move: string
      let face: string

      do {
        move =
          moveNames[
            Math.floor(
              Math.random() * moveNames.length
            )
          ]

        face = move[0]
      } while (face === previousFace)

      scrambledCube = moves[move](scrambledCube)
      scramble.push(move)

      previousFace = face
    }

    setCube(scrambledCube)
    setMoveHistory(scramble)
  }

  function resetCube() {
    setCube(createSolvedCube())
    setMoveHistory([])
  }

  function clearHistory() {
    setMoveHistory([])
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Rubik's Cube Solver</h1>
          <p>Interactive Cube Engine</p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={scrambleCube}
          >
            🎲 Scramble
          </button>

          <button
            className="secondary-button"
            onClick={undoMove}
            disabled={moveHistory.length === 0}
          >
            ↩ Undo
          </button>

          <button
            className="reset-button"
            onClick={resetCube}
          >
            Reset
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="cube-section">
          <h2>Cube</h2>

          <div className="cube-net">
            {faceOrder.map((faceName) => (
              <CubeFace
                key={faceName}
                name={faceName}
                face={cube[faceName]}
              />
            ))}
          </div>
        </section>

        <section className="controls-section">
          <h2>Moves</h2>

          <div className="move-groups">
            {(
              ["U", "R", "F", "L", "D", "B"] as FaceName[]
            ).map((face) => (
              <div
                className="move-group"
                key={face}
              >
                <h3>{face} Face</h3>

                <div className="move-buttons">
                  <button
                    onClick={() => applyMove(face)}
                  >
                    {face}
                  </button>

                  <button
                    onClick={() =>
                      applyMove(`${face}'`)
                    }
                  >
                    {face}'
                  </button>

                  <button
                    onClick={() =>
                      applyMove(`${face}2`)
                    }
                  >
                    {face}2
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="history-section">
          <div className="history-header">
            <h2>Move History</h2>

            <button
              className="clear-button"
              onClick={clearHistory}
            >
              Clear
            </button>
          </div>

          {moveHistory.length === 0 ? (
            <p className="empty-history">
              No moves yet.
            </p>
          ) : (
            <div className="history">
              {moveHistory.map((move, index) => (
                <span
                  key={index}
                  className="history-move"
                >
                  {move}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App