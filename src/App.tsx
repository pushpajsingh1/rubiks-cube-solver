import { useEffect, useMemo, useState } from "react"
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
import { solveCube } from "./cube/solver/solver"
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

const faces: FaceName[] = [
  "U",
  "R",
  "F",
  "L",
  "B",
  "D",
]

const faceLabels: Record<FaceName, string> = {
  U: "Up",
  R: "Right",
  F: "Front",
  L: "Left",
  B: "Back",
  D: "Down",
}

const moveGroups = [
  {
    face: "U",
    moves: ["U", "U'", "U2"],
  },
  {
    face: "R",
    moves: ["R", "R'", "R2"],
  },
  {
    face: "F",
    moves: ["F", "F'", "F2"],
  },
  {
    face: "L",
    moves: ["L", "L'", "L2"],
  },
  {
    face: "D",
    moves: ["D", "D'", "D2"],
  },
  {
    face: "B",
    moves: ["B", "B'", "B2"],
  },
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
    <div className="cube-face-card">
      <div className="face-title">
        <span>{name}</span>
        <small>{faceLabels[name]}</small>
      </div>

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
    createSolvedCube(),
  )

  const [solution, setSolution] = useState<string[]>([])
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [isSolving, setIsSolving] = useState(false)
  const [currentSolutionMove, setCurrentSolutionMove] =
    useState(-1)

  const [rotation, setRotation] = useState({
    x: -18,
    y: 25,
  })

  const [showStats, setShowStats] = useState(true)

  const totalMoves = moveHistory.length

  const isSolved = useMemo(() => {
    return faces.every((face) => {
      const stickers = cube[face]
      return stickers.every(
        (sticker) => sticker === stickers[4],
      )
    })
  }, [cube])

  function applyMove(move: string) {
    if (isSolving) return

    const moveFunction = moves[move]

    if (!moveFunction) return

    setCube((currentCube) =>
      moveFunction(currentCube),
    )

    setMoveHistory((history) => [
      ...history,
      move,
    ])

    setSolution([])
    setCurrentSolutionMove(-1)
  }

  function undoMove() {
    if (isSolving || moveHistory.length === 0) return

    const lastMove =
      moveHistory[moveHistory.length - 1]

    const inverse =
      lastMove.endsWith("'")
        ? lastMove.slice(0, -1)
        : lastMove.endsWith("2")
          ? lastMove
          : `${lastMove}'`

    const moveFunction = moves[inverse]

    if (!moveFunction) return

    setCube((currentCube) =>
      moveFunction(currentCube),
    )

    setMoveHistory((history) =>
      history.slice(0, -1),
    )

    setSolution([])
    setCurrentSolutionMove(-1)
  }

  function resetCube() {
    if (isSolving) return

    setCube(createSolvedCube())
    setMoveHistory([])
    setSolution([])
    setCurrentSolutionMove(-1)
  }

  function clearHistory() {
    if (isSolving) return

    setMoveHistory([])
  }

  function scrambleCube() {
    if (isSolving) return

    let scrambledCube = createSolvedCube()
    const scramble: string[] = []

    let previousFace = ""

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

    for (let i = 0; i < 20; i++) {
      let move = ""
      let face = ""

      do {
        move =
          moveNames[
            Math.floor(
              Math.random() * moveNames.length,
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
    setSolution([])
    setCurrentSolutionMove(-1)
  }

  function solveCurrentCube() {
    if (isSolving) return

    const result = solveCube(cube)

    if (!result.solved) {
      alert(
        "Could not solve this cube within the current search depth.",
      )
      return
    }

    if (result.moves.length === 0) {
      setSolution([])
      setCurrentSolutionMove(-1)
      return
    }

    setSolution(result.moves)
    setCurrentSolutionMove(-1)
    setIsSolving(true)

    let currentCube = cube
    let currentHistory = [...moveHistory]

    result.moves.forEach((move, index) => {
      setTimeout(() => {
        const moveFunction = moves[move]

        if (!moveFunction) return

        currentCube = moveFunction(currentCube)
        currentHistory = [
          ...currentHistory,
          move,
        ]

        setCube(currentCube)
        setMoveHistory(currentHistory)
        setCurrentSolutionMove(index)

        if (
          index ===
          result.moves.length - 1
        ) {
          setIsSolving(false)
        }
      }, (index + 1) * 350)
    })
  }

  function rotateLeft() {
    setRotation((current) => ({
      ...current,
      y: current.y - 20,
    }))
  }

  function rotateRight() {
    setRotation((current) => ({
      ...current,
      y: current.y + 20,
    }))
  }

  function rotateUp() {
    setRotation((current) => ({
      ...current,
      x: current.x - 15,
    }))
  }

  function rotateDown() {
    setRotation((current) => ({
      ...current,
      x: current.x + 15,
    }))
  }

  function resetView() {
    setRotation({
      x: -18,
      y: 25,
    })
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isSolving) return

      const key = event.key.toUpperCase()

      if (
        [
          "U",
          "R",
          "F",
          "L",
          "D",
          "B",
        ].includes(key)
      ) {
        applyMove(key)
      }

      if (event.key === "Escape") {
        resetCube()
      }

      if (
        event.key === "Backspace"
      ) {
        undoMove()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [isSolving, moveHistory])

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Rubik's Cube Solver</h1>
            <p>Interactive Cube Engine</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={scrambleCube}
            disabled={isSolving}
          >
            🎲 Scramble
          </button>

          <button
            className="secondary-button"
            onClick={undoMove}
            disabled={
              isSolving ||
              moveHistory.length === 0
            }
          >
            ↩ Undo
          </button>

          <button
            className="solve-button"
            onClick={solveCurrentCube}
            disabled={isSolving}
          >
            {isSolving
              ? "Solving..."
              : "🧩 Solve Cube"}
          </button>

          <button
            className="reset-button"
            onClick={resetCube}
            disabled={isSolving}
          >
            Reset
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-text">
            <div className="status-pill">
              <span
                className={
                  isSolved
                    ? "status-dot solved"
                    : "status-dot"
                }
              />

              {isSolved
                ? "Cube Solved"
                : "Cube Scrambled"}
            </div>

            <h2>
              Master the cube.
              <br />
              <span>One move at a time.</span>
            </h2>

            <p>
              Explore the cube, experiment with
              moves, and let the search solver find
              a solution.
            </p>
          </div>

          <div className="stats-panel">
            <div className="stat">
              <strong>{totalMoves}</strong>
              <span>Moves</span>
            </div>

            <div className="stat">
              <strong>
                {solution.length}
              </strong>
              <span>Solution</span>
            </div>

            <div className="stat">
              <strong>8</strong>
              <span>Max Depth</span>
            </div>
          </div>
        </section>

        <section className="workspace">
          <div className="cube-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  VISUALIZER
                </span>
                <h2>Cube View</h2>
              </div>

              <button
                className="view-button"
                onClick={resetView}
              >
                Reset View
              </button>
            </div>

            <div className="cube-stage">
              <div
                className="cube-display"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
              >
                <div className="cube-shadow" />

                <div className="visual-face visual-front">
                  {cube.F.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>

                <div className="visual-face visual-back">
                  {cube.B.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>

                <div className="visual-face visual-right">
                  {cube.R.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>

                <div className="visual-face visual-left">
                  {cube.L.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>

                <div className="visual-face visual-top">
                  {cube.U.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>

                <div className="visual-face visual-bottom">
                  {cube.D.map(
                    (color, index) => (
                      <div
                        key={index}
                        className={getColorClass(
                          color,
                        )}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="rotation-controls">
              <button onClick={rotateLeft}>
                ←
              </button>

              <button onClick={rotateUp}>
                ↑
              </button>

              <button onClick={resetView}>
                ◉
              </button>

              <button onClick={rotateDown}>
                ↓
              </button>

              <button onClick={rotateRight}>
                →
              </button>
            </div>

            <p className="interaction-hint">
              Use the controls to rotate the cube
            </p>
          </div>

          <div className="side-panel">
            <section className="card">
              <div className="section-header">
                <div>
                  <span className="eyebrow">
                    CONTROLS
                  </span>
                  <h2>Cube Moves</h2>
                </div>
              </div>

              <div className="move-groups">
                {moveGroups.map(
                  (group) => (
                    <div
                      className="move-group"
                      key={group.face}
                    >
                      <div className="move-label">
                        <strong>
                          {group.face}
                        </strong>
                        <span>
                          {
                            faceLabels[
                              group.face as FaceName
                            ]
                          }
                        </span>
                      </div>

                      <div className="move-buttons">
                        {group.moves.map(
                          (move) => (
                            <button
                              key={move}
                              onClick={() =>
                                applyMove(
                                  move,
                                )
                              }
                              disabled={
                                isSolving
                              }
                            >
                              {move}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="keyboard-tip">
                <span>⌨</span>
                <div>
                  <strong>
                    Keyboard controls
                  </strong>
                  <small>
                    U R F L D B = face moves
                    • Backspace = undo
                    • Esc = reset
                  </small>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="bottom-grid">
          <section className="card history-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  HISTORY
                </span>
                <h2>Move History</h2>
              </div>

              <button
                className="clear-button"
                onClick={clearHistory}
                disabled={
                  isSolving ||
                  moveHistory.length === 0
                }
              >
                Clear
              </button>
            </div>

            {moveHistory.length === 0 ? (
              <div className="empty-state">
                <span>◇</span>
                <p>No moves yet</p>
                <small>
                  Start by clicking a move above
                </small>
              </div>
            ) : (
              <div className="history">
                {moveHistory.map(
                  (move, index) => (
                    <span
                      key={index}
                      className="history-move"
                    >
                      <small>
                        {index + 1}
                      </small>
                      {move}
                    </span>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="card solution-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  SOLVER
                </span>
                <h2>Solution</h2>
              </div>

              {solution.length > 0 && (
                <span className="solution-count">
                  {solution.length} moves
                </span>
              )}
            </div>

            {solution.length === 0 ? (
              <div className="empty-state">
                <span>✧</span>
                <p>No solution yet</p>
                <small>
                  Scramble the cube and press
                  Solve Cube
                </small>
              </div>
            ) : (
              <div className="solution-list">
                {solution.map(
                  (move, index) => (
                    <span
                      key={index}
                      className={
                        index ===
                        currentSolutionMove
                          ? "solution-move active"
                          : "solution-move"
                      }
                    >
                      {move}
                    </span>
                  ),
                )}
              </div>
            )}
          </section>
        </section>

        <section className="cube-net-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                COMPLETE STATE
              </span>
              <h2>Cube Net</h2>
            </div>

            <button
              className="view-button"
              onClick={() =>
                setShowStats(!showStats)
              }
            >
              {showStats
                ? "Hide Details"
                : "Show Details"}
            </button>
          </div>

          {showStats && (
            <div className="cube-net">
              {faces.map((face) => (
                <CubeFace
                  key={face}
                  name={face}
                  face={cube[face]}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>
          Rubik's Cube Solver
        </span>

        <span>
          Interactive Search Engine
        </span>
      </footer>
    </div>
  )
}

export default App