import { useCallback , useEffect, useMemo, useState } from "react"
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
import CubeColorInput from "./cube/input/CubeColorInput"
import Cube3D from "./cube/Cube3D"
import "./App.css"

type MoveFunction = (cube: CubeState) => CubeState

const moveInstructions: Record<
  string,
  {
    face: string
    direction: string
    detail: string
  }
> = {
  U: {
    face: "TOP",
    direction: "Clockwise",
    detail: "Turn the top face clockwise.",
  },
  "U'": {
    face: "TOP",
    direction: "Counter-clockwise",
    detail: "Turn the top face counter-clockwise.",
  },
  U2: {
    face: "TOP",
    direction: "180°",
    detail: "Turn the top face twice.",
  },
  R: {
    face: "RIGHT",
    direction: "Clockwise",
    detail: "Turn the right face clockwise.",
  },
  "R'": {
    face: "RIGHT",
    direction: "Counter-clockwise",
    detail: "Turn the right face counter-clockwise.",
  },
  R2: {
    face: "RIGHT",
    direction: "180°",
    detail: "Turn the right face twice.",
  },
  F: {
    face: "FRONT",
    direction: "Clockwise",
    detail: "Turn the front face clockwise.",
  },
  "F'": {
    face: "FRONT",
    direction: "Counter-clockwise",
    detail: "Turn the front face counter-clockwise.",
  },
  F2: {
    face: "FRONT",
    direction: "180°",
    detail: "Turn the front face twice.",
  },
  L: {
    face: "LEFT",
    direction: "Clockwise",
    detail: "Turn the left face clockwise.",
  },
  "L'": {
    face: "LEFT",
    direction: "Counter-clockwise",
    detail: "Turn the left face counter-clockwise.",
  },
  L2: {
    face: "LEFT",
    direction: "180°",
    detail: "Turn the left face twice.",
  },
  D: {
    face: "BOTTOM",
    direction: "Clockwise",
    detail: "Turn the bottom face clockwise.",
  },
  "D'": {
    face: "BOTTOM",
    direction: "Counter-clockwise",
    detail: "Turn the bottom face counter-clockwise.",
  },
  D2: {
    face: "BOTTOM",
    direction: "180°",
    detail: "Turn the bottom face twice.",
  },
  B: {
    face: "BACK",
    direction: "Clockwise",
    detail: "Turn the back face clockwise.",
  },
  "B'": {
    face: "BACK",
    direction: "Counter-clockwise",
    detail: "Turn the back face counter-clockwise.",
  },
  B2: {
    face: "BACK",
    direction: "180°",
    detail: "Turn the back face twice.",
  },
}

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
  const [animatingMove, setAnimatingMove] = useState<string | null>(null)

const [solutionStartCube, setSolutionStartCube] =
  useState<CubeState | null>(null)

  const totalMoves = moveHistory.length

  const isSolved = useMemo(() => {
    return faces.every((face) => {
      const stickers = cube[face]
      return stickers.every(
        (sticker) => sticker === stickers[4],
      )
    })
  }, [cube])

  const applyMove = useCallback((move: string) => {
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
  }, [isSolving])

    const undoMove = useCallback(() => {
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
  }, [isSolving, moveHistory])

  const resetCube = useCallback(() => {
    if (isSolving) return

    setCube(createSolvedCube())
    setMoveHistory([])
    setSolution([])
    setCurrentSolutionMove(-1)
  }, [isSolving])

  function nextSolutionMove() {
  if (
    isSolving ||
    animatingMove !== null ||
    solution.length === 0
  ) {
    return
  }

  const nextIndex = currentSolutionMove + 1

  if (nextIndex >= solution.length) return

  const move = solution[nextIndex]
  const moveFunction = moves[move]

  if (!moveFunction) return

  setAnimatingMove(move)

  window.setTimeout(() => {
    setCube((currentCube) => moveFunction(currentCube))
    setMoveHistory((history) => [...history, move])
    setCurrentSolutionMove(nextIndex)
    setAnimatingMove(null)
  }, 700)
}

function previousSolutionMove() {
  if (
    isSolving ||
    solution.length === 0 ||
    !solutionStartCube ||
    animatingMove !== null ||
    currentSolutionMove < 0
  ) {
    return
  }

  const targetIndex = currentSolutionMove - 1

  if (targetIndex < 0) {
    setCube(solutionStartCube)
    setMoveHistory([])
    setCurrentSolutionMove(-1)
    return
  }

  let rebuiltCube = solutionStartCube

  for (let index = 0; index <= targetIndex; index++) {
    const move = solution[index]
    const moveFunction = moves[move]

    if (moveFunction) {
      rebuiltCube = moveFunction(rebuiltCube)
    }
  }

  setCube(rebuiltCube)
  setMoveHistory(solution.slice(0, targetIndex + 1))
  setCurrentSolutionMove(targetIndex)
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
      let move: string
      let face: string

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

  const activeMove =
    solution.length > 0
      ? solution[Math.max(0, currentSolutionMove)]
      : null

  const activeInstruction = activeMove
    ? moveInstructions[activeMove]
    : null

function solveCurrentCube(cubeToSolve = cube) {
  if (isSolving) return

  const result = solveCube(cubeToSolve)

  if (!result.solved) {
    alert(
      "Could not solve this cube within the current search depth.",
    )
    return
  }

  setSolutionStartCube(cubeToSolve)

  if (result.moves.length === 0) {
    setSolution([])
    setCurrentSolutionMove(-1)
    return
  }

  // Show the solution without automatically executing it.
  setSolution(result.moves)
  setCurrentSolutionMove(-1)
  setIsSolving(false)
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
  }, [
  isSolving,
  applyMove,
  resetCube,
  undoMove,
])

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
            onClick={() => solveCurrentCube()}
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

        <section className="workspace custom-workspace">
    <CubeColorInput
      onCubeChange={(enteredCube) => setCube(enteredCube)}
      onCubeReady={(enteredCube) => solveCurrentCube(enteredCube)}
    />
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
              <Cube3D
                cube={cube}
                animatingMove={animatingMove}
                rotation={rotation}
              />
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

            {solution.length > 0 && (
             <div className="solving-guide">
               <div className="guide-header">
                 <div>
                   <span className="eyebrow">SOLVING GUIDE</span>
                   <h3>
                     Step {Math.max(1, currentSolutionMove + 1)} of{" "}
                     {solution.length}
                   </h3>
                 </div>

                 <span className="guide-move-badge">
                   {activeMove ?? solution[0]}
                 </span>
               </div>

               <div className="hold-card">
                 <span className="hold-icon">🧊</span>
                 <div>
                   <strong>Hold Your Cube</strong>
                   <p>
                     Keep <b>White on Top</b>, <b>Green facing Front</b>,
                     and <b>Red on the Right</b>.
                   </p>
                 </div>
               </div>

               {activeInstruction && (
                 <div className="move-instruction">
                   <div className="instruction-face">
                     <span className="instruction-arrow">↻</span>
                     <strong>{activeInstruction.face}</strong>
                   </div>

                   <div className="instruction-content">
                     <span className="instruction-label">
                       PERFORM THIS MOVE
                     </span>
                     <h3>
                       {activeMove} — {activeInstruction.direction}
                     </h3>
                     <p>{activeInstruction.detail}</p>
                     <small>
                       Clockwise means turning the face clockwise while
                       looking directly at that face.
                     </small>
                   </div>
                 </div>
               )}

               <div className="guide-controls">
                 <button
                   type="button"
                   className="guide-button"
                   disabled={currentSolutionMove <= 0}
                  onClick={previousSolutionMove}
                 >
                   ← Previous
                 </button>

                 <div className="guide-progress">
                   <div
                     className="guide-progress-bar"
                     style={{
                       width: `${Math.min(
                         100,
                         ((currentSolutionMove + 1) / solution.length) *
                           100,
                       )}%`,
                     }}
                   />
                 </div>

                 <button
                   type="button"
                   className="guide-button primary"
                   disabled={
                     currentSolutionMove >= solution.length - 1
                   }
                  onClick={nextSolutionMove}
                 >
                   Next →
                 </button>
               </div>
             </div>
           )}

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
