function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Rubik's Cube Solver
        </h1>

        <p className="mt-4 text-gray-400">
          Your interactive cube solver
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            Scramble
          </button>

          <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700">
            Solve
          </button>

          <button className="rounded-lg bg-gray-700 px-6 py-3 font-semibold hover:bg-gray-600">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default App