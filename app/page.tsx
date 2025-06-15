'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from '@/components/Dashboard'
import UserSelection from '@/components/UserSelection'
import userStorage from '@/lib/userStorage'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user
    const user = userStorage.getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
    setIsLoading(false)
  }, [])

  const handleUserSelect = (user: any) => {
    userStorage.setCurrentUser(user.id)
    setCurrentUser(user)
    setShowUserSelection(false)
  }

  const handleUserCreate = (name: string, avatar: any) => {
    const user = userStorage.createUser(name, avatar)
    handleUserSelect(user)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-starry flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Dashboard 
        currentUser={currentUser}
        onUserSwitch={() => setShowUserSelection(true)}
        onNewUser={() => setShowUserSelection(true)}
      />
      
      <AnimatePresence>
        {showUserSelection && (
          <UserSelection
            onUserSelect={handleUserSelect}
            onUserCreate={handleUserCreate}
            onClose={() => setShowUserSelection(false)}
            existingUsers={userStorage.getAllUsers()}
          />
        )}
      </AnimatePresence>
    </>
  )
}