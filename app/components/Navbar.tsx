import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex gap-8">
        <Link href="/" className="hover:text-blue-400 transition">
          Home
        </Link>
        <Link href="/projects" className="hover:text-blue-400 transition">
          Projects
        </Link>
      </div>
    </nav>
  )
}