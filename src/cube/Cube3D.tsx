import type { CubeColor, CubeState } from "./CubeState"
import "./Cube3D.css"

type Props = {
  cube: CubeState
  animatingMove?: string | null
  rotation?: {
    x: number
    y: number
  }
}

type Position = {
  x: number
  y: number
  z: number
}

const positions: Position[] = []

for (const x of [-1, 0, 1]) {
  for (const y of [-1, 0, 1]) {
    for (const z of [-1, 0, 1]) {
      positions.push({ x, y, z })
    }
  }
}

function colorClass(color: CubeColor) {
  return `cube3d-sticker sticker-${color}`
}

function faceIndex(row: number, col: number) {
  return row * 3 + col
}

function getSticker(
  cube: CubeState,
  position: Position,
  face: "F" | "B" | "R" | "L" | "U" | "D",
) {
  const { x, y, z } = position

  if (face === "F" && z === 1) return cube.F[faceIndex(1 - y, x + 1)]
  if (face === "B" && z === -1) return cube.B[faceIndex(1 - y, 1 - x)]
  if (face === "R" && x === 1) return cube.R[faceIndex(1 - y, z + 1)]
  if (face === "L" && x === -1) return cube.L[faceIndex(1 - y, 1 - z)]
  if (face === "U" && y === 1) return cube.U[faceIndex(1 - z, x + 1)]
  if (face === "D" && y === -1) return cube.D[faceIndex(z + 1, x + 1)]

  return null
}

function isInAnimatedLayer(position: Position, move: string | null) {
  if (!move) return false

  switch (move[0]) {
    case "R":
      return position.x === 1
    case "L":
      return position.x === -1
    case "U":
      return position.y === 1
    case "D":
      return position.y === -1
    case "F":
      return position.z === 1
    case "B":
      return position.z === -1
    default:
      return false
  }
}

function getLayerClass(move: string | null) {
  if (!move) return ""

  const reverse = move.endsWith("'")
  const double = move.endsWith("2")

  if (double) return `cube3d-layer-${move[0]}-double`
  if (reverse) return `cube3d-layer-${move[0]}-reverse`

  return `cube3d-layer-${move[0]}`
}

function Cubie({
  cube,
  position,
}: {
  cube: CubeState
  position: Position
}) {
  return (
    <div
      className="cube3d-cubie"
      style={{
        transform: `translate3d(
          ${position.x * 54}px,
          ${-position.y * 54}px,
          ${position.z * 54}px
        )`,
      }}
    >
      {(
        [
          ["front", "F"],
          ["back", "B"],
          ["right", "R"],
          ["left", "L"],
          ["top", "U"],
          ["bottom", "D"],
        ] as const
      ).map(([className, face]) => {
        const color = getSticker(cube, position, face)

        if (!color) return null

        return (
          <div
            key={className}
            className={`cube3d-face cube3d-face-${className}`}
          >
            <div className={colorClass(color)} />
          </div>
        )
      })}
    </div>
  )
}

export default function Cube3D({
  cube,
  animatingMove = null,
  rotation = { x: -18, y: -32 },
}: Props) {
  const animatedPositions = positions.filter((position) =>
    isInAnimatedLayer(position, animatingMove),
  )

  const staticPositions = positions.filter(
    (position) => !isInAnimatedLayer(position, animatingMove),
  )

  return (
    <div className="cube3d-scene">
      <div
        className="cube3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="cube3d-static">
          {staticPositions.map((position) => (
            <Cubie
              key={`${position.x}-${position.y}-${position.z}`}
              cube={cube}
              position={position}
            />
          ))}
        </div>

        {animatingMove && (
          <div
            className={`cube3d-layer ${getLayerClass(animatingMove)}`}
          >
            {animatedPositions.map((position) => (
              <Cubie
                key={`${position.x}-${position.y}-${position.z}`}
                cube={cube}
                position={position}
              />
            ))}
          </div>
        )}

        {!animatingMove && (
          <div className="cube3d-all">
            {positions.map(() => null)}
          </div>
        )}
      </div>
    </div>
  )
}
