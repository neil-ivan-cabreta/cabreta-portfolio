'use client'
import { motion } from 'framer-motion'
import StarryBackground from '../components/StarryBackground'

export default function Projects() {
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
          <h1 className="text-5xl font-bold">My Projects</h1>
          <p className="mt-4 text-xl text-gray-300">Here are some things I've built</p>
          
          <div className="mt-12 grid gap-6">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg"
            >
              <h3 className="text-2xl font-semibold">Project 1</h3>
              <p className="text-gray-300 mt-2">Description of your project</p>
              <div className="mt-4 flex gap-4">
                <a href="#" className="text-blue-400 hover:text-blue-300">View Demo</a>
                <a href="#" className="text-blue-400 hover:text-blue-300">GitHub</a>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg"
            >
              <h3 className="text-2xl font-semibold">Project 2</h3>
              <p className="text-gray-300 mt-2">Description of your project</p>
              <div className="mt-4 flex gap-4">
                <a href="#" className="text-blue-400 hover:text-blue-300">View Demo</a>
                <a href="#" className="text-blue-400 hover:text-blue-300">GitHub</a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </>
  )
}