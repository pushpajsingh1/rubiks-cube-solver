function App() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold">
            Rubik's Cube Solver
          </h1>

          <p className="mt-1 text-gray-400">
            Interactive cube solving and visualization
          </p>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">

        {/* Cube viewer */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Cube Viewer
          </h2>

          <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-950">
            <p className="text-gray-500">
              3D Cube Coming Soon
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Controls
          </h2>

          <div className="space-y-3">
            <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-700">
              Scramble
            </button>

            <button className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold transition hover:bg-green-700">
              Solve
            </button>

            <button className="w-full rounded-lg bg-gray-700 px-4 py-3 font-semibold transition hover:bg-gray-600">
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Move history */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">
            Move History
          </h2>

          <p className="text-gray-500">
            No moves yet
          </p>
        </div>
      </section>
    </main>
  )
}

export default App 