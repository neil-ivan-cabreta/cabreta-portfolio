'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  stuckTime: number
  visible: boolean
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
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Star[] = []
    const mouse = { x: 0, y: 0 }
    const numStars = 150
    const connectionDistance = 150
    let animationFrameId: number;

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
          if (!this.visible) return;

          ctx.beginPath()
          ctx.save()
          ctx.shadowBlur = 10;
          ctx.shadowColor = "white";
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff' 
          ctx.fill()
          ctx.restore()
        },

        update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number; y: number }) {
          this.x += this.vx
          this.y += this.vy

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1

          if (this.stuckTime > 0) this.stuckTime--;

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
            // Draw normal line
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle = `rgba(100, 149, 237, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            // --- MAGNET LOGIC ---
            if (distance < 20) {
              stars[i].stuckTime++;
              stars[j].stuckTime++;

              if (stars[i].stuckTime > 150 || stars[j].stuckTime > 150) {
                 const blast = 0.05; 
                 stars[i].vx -= dx * blast;
                 stars[i].vy -= dy * blast;
                 stars[j].vx += dx * blast;
                 stars[j].vy += dy * blast;
                 stars[i].stuckTime = 0;
                 stars[j].stuckTime = 0;
              } else {
                 const magnet = 0.005; 
                 stars[i].x -= dx * magnet;
                 stars[i].y -= dy * magnet;
                 stars[j].x += dx * magnet;
                 stars[j].y += dy * magnet;
              }
            }

            // --- DIAMOND FLASH LOGIC ---
            if (distance < 10) {
              stars[i].visible = false;
              stars[j].visible = false;

              const midX = (stars[i].x + stars[j].x) / 2
              const midY = (stars[i].y + stars[j].y) / 2
              
              // 1. CALCULATE SIZE: Sum of radii * multiplier (2.5 gives a good range)
              const diamondSize = (stars[i].radius + stars[j].radius) * 2.5;

              ctx.save()
              ctx.shadowBlur = 10
              ctx.shadowColor = "white"
              ctx.fillStyle = "rgba(255, 255, 255, 1)" 

              ctx.beginPath()
              // 2. APPLY SIZE: Replaced static '8' with 'diamondSize'
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

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        star.visible = true; 
        star.update(ctx, canvas, mouse);
      });

      drawConnections(ctx, stars);

      stars.forEach(star => star.draw(ctx));

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
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