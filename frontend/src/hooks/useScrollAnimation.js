import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Returns a ref and a boolean `inView` that becomes true once the element
 * enters the viewport. Useful for triggering one-shot scroll animations.
 *
 * @param {object} options
 * @param {number} [options.margin] - rootMargin offset in px (negative = trigger earlier)
 * @param {boolean} [options.once] - only trigger once (default: true)
 */
export const useScrollAnimation = ({ margin = -60, once = true } = {}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: `${margin}px` })
  return { ref, inView }
}

/** Preset animation variants for common scroll effects */
export const scrollVariants = {
  /** Fade up — default card entrance */
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
    }),
  },

  /** Fade in from left */
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },

  /** Fade in from right */
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },

  /** Scale up from slightly smaller */
  scaleUp: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }),
  },

  /** Stagger container — wraps children with staggered entrance */
  stagger: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  },

  /** Slide in from bottom (no blur — safe for all FM versions) */
  blurUp: {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  },
}
