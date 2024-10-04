"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GlowingPointerCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)
    const [userNumber, setUserNumber] = useState('')

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
        }

        const handleMouseLeave = () => {
            setIsVisible(false)
        }

        setUserNumber(Math.floor(Math.random() * 90000 + 10000).toString())

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="pointer-events-none fixed left-0 top-0 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: position.x, y: position.y }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                >
                    <div className="relative">
                        {/* Pink pointer cursor with glow */}
                        <motion.div
                            className="absolute -left-1 -top-1 h-0 w-0"
                            animate={{
                                boxShadow: ['0 0 10px 5px rgba(255, 105, 180, 0.3)', '0 0 20px 10px rgba(255, 105, 180, 0.5)', '0 0 10px 5px rgba(255, 105, 180, 0.3)']
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            style={{
                                borderLeft: '12px solid transparent',
                                borderRight: '12px solid transparent',
                                borderBottom: '20px solid hotpink',
                                transform: 'rotate(-45deg)',
                            }}
                        />

                        {/* Speech bubble */}
                        <motion.div
                            className="absolute left-6 -top-1 rounded-lg bg-white border-2 border-blue-300 px-4 py-2 text-sm font-semibold shadow-lg"
                            style={{
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                            <div className="absolute -left-2 top-2.5 h-3 w-3 rotate-45 bg-white border-l-2 border-b-2 border-blue-300" />
                            <span className="relative z-10 text-blue-600">
                                User{userNumber}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}