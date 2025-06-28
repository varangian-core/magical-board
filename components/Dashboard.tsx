'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { kingdoms } from '@/lib/kingdoms'
import boardStorage from '@/lib/boardStorage'
import KingdomCard from './KingdomCard'
import CreateBoardModal from './CreateBoardModal'

interface DashboardProps {
  currentUser: any
  onUserSwitch: () => void
  onNewUser: () => void
}

export default function Dashboard({ currentUser, onUserSwitch, onNewUser }: DashboardProps) {
  const [selectedKingdom, setSelectedKingdom] = useState<string | null>(null)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [kingdomBoards, setKingdomBoards] = useState<any>({})

  useEffect(() => {
    // Load boards for each kingdom
    const boards: any = {}
    kingdoms.forEach(kingdom => {
      boards[kingdom.id] = boardStorage.getBoardsByKingdom(kingdom.id)
    })
    setKingdomBoards(boards)
  }, [])

  const handleCreateBoard = (name: string, description?: string) => {
    if (selectedKingdom && currentUser) {
      const board = boardStorage.createBoard(name, selectedKingdom, currentUser.id, description)
      
      // Update local state
      setKingdomBoards((prev: any) => ({
        ...prev,
        [selectedKingdom]: [...(prev[selectedKingdom] || []), board]
      }))
      
      setShowCreateBoard(false)
      
      // Navigate to the board using Next.js router
      window.location.href = `/board/${board.id}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.8 + 0.2
            }}
            animate={{
              y: [null, -100],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatDelay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end items-center gap-4">
              {currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <span className="text-2xl">{currentUser.avatar.emoji}</span>
                  <div className="text-white">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-xs opacity-80">{currentUser.avatar.name}</p>
                  </div>
                  <button
                    onClick={onUserSwitch}
                    className="ml-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Switch
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={onNewUser}
                  className="magical-button"
                >
                  Create Guardian
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-white mb-8 text-center"
            >
              Choose Your Magical Kingdom
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kingdoms.map((kingdom, index) => (
                <KingdomCard
                  key={kingdom.id}
                  kingdom={kingdom}
                  boards={kingdomBoards[kingdom.id] || []}
                  index={index}
                  onCreateBoard={() => {
                    if (!currentUser) {
                      onNewUser()
                    } else {
                      setSelectedKingdom(kingdom.id)
                      setShowCreateBoard(true)
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Board Modal */}
      {showCreateBoard && selectedKingdom && (
        <CreateBoardModal
          kingdom={kingdoms.find(k => k.id === selectedKingdom)!}
          onClose={() => setShowCreateBoard(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  )
}