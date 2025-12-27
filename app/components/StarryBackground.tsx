'use client'
import { useEffect, useRef, useState } from 'react'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  stuckTime: number
  visible: boolean
  draw: (ctx: CanvasRenderingContext2D) => void
  update: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number; y: number }, gravityWells: GravityWell[]) => void
}

interface GravityWell {
  x: number
  y: number
  strength: number
  life: number
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fps, setFps] = useState(60)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Star[] = []
    const gravityWells: GravityWell[] = []
    const mouse = { x: 0, y: 0 }
    const numStars = 150
    const maxStars = 200 // Cap total stars
    const maxGravityWells = 3 // Limit active gravity wells
    const connectionDistance = 150
    let animationFrameId: number
    let lastTime = performance.now()
    let frameCount = 0
    let lastClickTime = 0
    const clickCooldown = 500 // 500ms cooldown between clicks

    function createStar(canvas: HTMLCanvasElement): Star {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.5 + 1,
        stuckTime: 0,
        visible: true,
        
        draw(ctx: CanvasRenderingContext2D) {
          if (!this.visible) return

          ctx.beginPath()
          ctx.save()
          ctx.shadowBlur = 10
          ctx.shadowColor = "white"
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff' 
          ctx.fill()
          ctx.restore()
        },

        update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number; y: number }, gravityWells: GravityWell[]) {
          // Apply gravity wells
          gravityWells.forEach(well => {
            const dx = well.x - this.x
            const dy = well.y - this.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 300) {
              const force = (well.strength / distance) * 0.5
              this.vx += (dx / distance) * force
              this.vy += (dy / distance) * force
            }
          })

          this.x += this.vx
          this.y += this.vy

          // Damping
          this.vx *= 0.995
          this.vy *= 0.995

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1

          if (this.stuckTime > 0) this.stuckTime--

          // Mouse repulsion
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const angle = Math.atan2(dy, dx)
            const force = (100 - distance) / 100 
            const repulsion = 6
            this.x += Math.cos(angle) * repulsion * force
            this.y += Math.sin(angle) * repulsion * force
          }
        }
      }
    }

    for (let i = 0; i < numStars; i++) {
      stars.push(createStar(canvas))
    }

    function drawConnections(ctx: CanvasRenderingContext2D, stars: Star[]) {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle = `rgba(100, 149, 237, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Magnet logic
            if (distance < 20) {
              stars[i].stuckTime++
              stars[j].stuckTime++

              if (stars[i].stuckTime > 150 || stars[j].stuckTime > 150) {
                 const blast = 0.05
                 stars[i].vx -= dx * blast
                 stars[i].vy -= dy * blast
                 stars[j].vx += dx * blast
                 stars[j].vy += dy * blast
                 stars[i].stuckTime = 0
                 stars[j].stuckTime = 0
              } else {
                 const magnet = 0.005
                 stars[i].x -= dx * magnet
                 stars[i].y -= dy * magnet
                 stars[j].x += dx * magnet
                 stars[j].y += dy * magnet
              }
            }

            // Diamond flash
            if (distance < 10) {
              stars[i].visible = false
              stars[j].visible = false

              const midX = (stars[i].x + stars[j].x) / 2
              const midY = (stars[i].y + stars[j].y) / 2
              const diamondSize = (stars[i].radius + stars[j].radius) * 2.5

              ctx.save()
              ctx.shadowBlur = 10
              ctx.shadowColor = "white"
              ctx.fillStyle = "rgba(255, 255, 255, 1)" 

              ctx.beginPath()
              ctx.moveTo(midX, midY - diamondSize)
              ctx.quadraticCurveTo(midX, midY, midX + diamondSize, midY)
              ctx.quadraticCurveTo(midX, midY, midX, midY + diamondSize)
              ctx.quadraticCurveTo(midX, midY, midX - diamondSize, midY)
              ctx.quadraticCurveTo(midX, midY, midX, midY - diamondSize)
              
              ctx.fill()
              ctx.restore()
            }
          }
        }
      }
    }

    function updateGravityWells() {
      for (let i = gravityWells.length - 1; i >= 0; i--) {
        gravityWells[i].life--
        if (gravityWells[i].life <= 0) {
          gravityWells.splice(i, 1)
        }
      }
    }

    function drawGravityWells(ctx: CanvasRenderingContext2D) {
      gravityWells.forEach(well => {
        const alpha = well.life / 60
        ctx.beginPath()
        ctx.arc(well.x, well.y, 20, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha * 0.5})`
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    function animate() {
      if (!canvas || !ctx) return
      
      // FPS calculation
      frameCount++
      const currentTime = performance.now()
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Clean up excess stars (keep oldest maxStars stars)
      if (stars.length > maxStars) {
        stars.splice(0, stars.length - maxStars)
      }

      stars.forEach(star => {
        star.visible = true
        star.update(ctx, canvas, mouse, gravityWells)
      })

      drawConnections(ctx, stars)
      stars.forEach(star => star.draw(ctx))
      updateGravityWells()
      drawGravityWells(ctx)

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleClick = (e: MouseEvent) => {
      const currentTime = Date.now()
      
      // Check cooldown
      if (currentTime - lastClickTime < clickCooldown) {
        return // Ignore click if within cooldown period
      }
      
      lastClickTime = currentTime

      // Limit active gravity wells
      if (gravityWells.length >= maxGravityWells) {
        // Remove oldest gravity well
        gravityWells.shift()
      }

      // Create gravity well
      gravityWells.push({
        x: e.clientX,
        y: e.clientY,
        strength: 50,
        life: 60
      })

      // Spawn stars only if under the cap
      if (stars.length < maxStars) {
        const starsToSpawn = Math.min(5, maxStars - stars.length)
        for (let i = 0; i < starsToSpawn; i++) {
          const star = createStar(canvas)
          star.x = e.clientX + (Math.random() - 0.5) * 20
          star.y = e.clientY + (Math.random() - 0.5) * 20
          stars.push(star)
        }
      }
    }

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        setShowStats(prev => !prev)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)
    window.addEventListener('keypress', handleKeyPress)

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keypress', handleKeyPress)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ background: 'linear-gradient(to bottom, #23273fff, #1a1a2e)' }}
      />
      {showStats && (
        <div className="fixed top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg font-mono text-sm z-50">
          <div>FPS: {fps}</div>
          <div className="text-xs text-gray-400 mt-2">Press 'S' to toggle</div>
        </div>
      )}
    </>
  )
}