import React, { useEffect, useRef } from 'react'

/**
 * Canvas-based floating particles background.
 * Lightweight, no extra deps — pure canvas 2D.
 */
const FloatingParticles = ({
  count = 40,
  color = '#00d4ff',
  opacity = 0.35,
  speed = 0.4,
  className = '',
}) => {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    // Parse hex color to rgb
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      alpha: Math.random() * opacity + 0.05,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
      })

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / 100) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [count, color, opacity, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}

export default FloatingParticles
