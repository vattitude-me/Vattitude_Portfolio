import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const over = () => setIsHovering(true)
    const out = () => setIsHovering(false)

    window.addEventListener('mousemove', move)

    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', over)
      el.addEventListener('mouseleave', out)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', over)
        el.removeEventListener('mouseleave', out)
      })
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: pos.x - 8, y: pos.y - 8, scale: isHovering ? 2.5 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-cyan-400/50 pointer-events-none z-[9998]"
        animate={{ x: pos.x - 20, y: pos.y - 20, scale: isHovering ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  )
}
