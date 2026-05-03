import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
}

const PageTransition = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial='initial'
        animate='animate'
        exit='exit'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
