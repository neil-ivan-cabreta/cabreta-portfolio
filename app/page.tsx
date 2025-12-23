export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold">Neil Ivan Isaac D. Cabreta</h1>
        <p className="mt-4 text-xl text-gray-400">Computer Science Undergraduatte</p>
        
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <p className="text-gray-300">
            I'm a CS student learning web development. Currently building 
            my portfolio with Next.js and Tailwind CSS.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Project 1</h3>
            <p className="text-gray-400 mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  )
}