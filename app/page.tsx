'use client'
import { motion } from 'framer-motion'
import StarryBackground from './components/StarryBackground'

export default function Home() {
  return (
    <>
      <StarryBackground />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen text-white p-8 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold">Your Name Here</h1>
          <p className="mt-4 text-xl text-gray-300">Computer Science Student</p>
          
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className="text-gray-200">
              I'm a CS student learning web development. Currently building 
              my portfolio with Next.js and Tailwind CSS.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">Projects</h2>
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold">Project 1</h3>
              <p className="text-gray-300 mt-2">Coming soon...</p>
            </div>
          </div>
        </div>
      </motion.main>
    </>
  )
}