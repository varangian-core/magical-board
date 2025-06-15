'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import UserSelection from '@/components/UserSelection'
import BoardList from '@/components/BoardList'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showTransformation, setShowTransformation] = useState(false)

  const handleUserSelect = (user: any) => {
    setShowTransformation(true)
    setTimeout(() => {
      setCurrentUser(user)
      setShowTransformation(false)
    }, 1500)
  }

  if (showTransformation) {
    return (
      <div className="min-h-screen bg-gradient-starry flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.5, 1], rotate: [0, 360, 720] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-64 h-64 bg-gradient-magical rounded-full blur-xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">⭐</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentUser) {
    return <UserSelection onUserSelect={handleUserSelect} />
  }

  return <BoardList currentUser={currentUser} />
}