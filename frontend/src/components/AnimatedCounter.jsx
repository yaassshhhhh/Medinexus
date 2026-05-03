import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Counts up from 0 to `end` when the element enters the viewport.
 * Supports suffixes like "K+", "+", "/5", etc.
 * e.g. value="50K+" → counts 0 → 50 then appends "K+"
 */
const AnimatedCounter = ({ value, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

    // Parse numeric part and suffix
    const match = String(value).match(/^([\d.]+)(.*)$/)
    if (!match) { setDisplay(value); return }

    const end = parseFloat(match[1])
    const suffix = match[2] || ''
    const isDecimal = match[1].includes('.')
    const decimals = isDecimal ? match[1].split('.')[1].length : 0

    const duration = 1800
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = end * eased
      setDisplay(current.toFixed(decimals) + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref} className={className}>{display}</span>
}

export default AnimatedCounter
