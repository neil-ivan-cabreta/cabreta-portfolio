'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  draw: (ctx: CanvasRenderingContext2D) => void
  update: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number; y: number }) => void
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Star and mouse properties
    const stars: Star[] = []
    const mouse = { x: 0, y: 0 }
    const numStars = 150
    const connectionDistance = 150
    let animationFrameId: number; // FIX: Added this back to prevent lag

    // Create star factory function
    function createStar(canvas: HTMLCanvasElement): Star {
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .70) * 1,
        vy: (Math.random() - .70) * 1,
        radius: Math.random() * 2 + 1,

        // --- GLOW EFFECT START ---
        draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath()
          ctx.save() // 1. Save state
          
          ctx.shadowBlur = 15; // 2. Glow size
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)"; // 3. Glow color
          
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fill()
          
          ctx.restore() // 4. Restore state so lines don't glow
        },
        // --- GLOW EFFECT END ---

        update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number; y: number }) {
          this.x += this.vx
          this.y += this.vy

          // Bounce off edges
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1

          // Mouse interaction
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // REPLACE YOUR "if (distance < 75)" BLOCK WITH THIS:
          
          // 1. Increase range to 150 so we have space to slow down
          if (distance < 100) {
            const angle = Math.atan2(dy, dx)
            
            // 2. Calculate "Push Force" (1.0 when close, 0.0 when far)
            const force = (100 - distance) / 100
            
            // 3. Apply force (Multiply by '8' for strong repulsion at center)
            const repulsion = 8
            
            this.x += Math.cos(angle) * repulsion * force
            this.y += Math.sin(angle) * repulsion * force
          }

          this.draw(ctx)
        }
      }
    }

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push(createStar(canvas))
    }

    // Draw connections between close stars
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
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (!canvas || !ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => star.update(ctx, canvas, mouse))
      drawConnections(ctx, stars)
      
      animationFrameId = requestAnimationFrame(animate) // FIX: Capture ID
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    // Resize handler
    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId) // FIX: Cancel animation
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #23273fff, #1a1a2e)' }}
    />
  )
}