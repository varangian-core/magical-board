'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import Link from 'next/link'

interface Board {
  id: string
  name: string
  theme: string
  createdAt: Date
}

interface BoardListProps {
  currentUser: any
}

const boardThemes = [
  { id: 'moon', name: 'Moon Kingdom', gradient: 'from-blue-200 to-purple-200' },
  { id: 'star', name: 'Star Palace', gradient: 'from-yellow-200 to-pink-200' },
  { id: 'crystal', name: 'Crystal Tower', gradient: 'from-cyan-200 to-blue-200' },
  { id: 'flower', name: 'Flower Garden', gradient: 'from-pink-200 to-green-200' },
]

export default function BoardList({ currentUser }: BoardListProps) {
  const [boards, setBoards] = useState<Board[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(boardThemes[0])

  const createBoard = () => {
    if (newBoardName) {
      const newBoard: Board = {
        id: nanoid(),
        name: newBoardName,
        theme: selectedTheme.name,
        createdAt: new Date(),
      }
      setBoards([...boards, newBoard])
      setShowCreateModal(false)
      setNewBoardName('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentUser.avatar.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold magical-gradient-text">
                Welcome, {currentUser.name}!
              </h1>
              <p className="text-sm text-magical-purple">{currentUser.avatar.name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="magical-button"
          >
            New Magical Board ✨
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link key={board.id} href={`/board/${board.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="magical-card p-6 cursor-pointer h-48 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
                  <p className="text-sm text-gray-600">{board.theme}</p>
                </div>
                <div className="text-xs text-gray-500">
                  Created {board.createdAt.toLocaleDateString()}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-xl text-magical-purple">
              No boards yet! Create your first magical board.
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="magical-card p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold magical-gradient-text mb-6">
              Create New Board
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-magical-purple mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Enter board name..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-magical-pink/30 
                           focus:border-magical-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-magical-purple mb-2">
                  Choose Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {boardThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-4 rounded-lg border-2 transition-all
                        ${selectedTheme.id === theme.id
                          ? 'border-magical-purple bg-gradient-to-br ' + theme.gradient
                          : 'border-magical-pink/30'
                        }`}
                    >
                      <div className="text-sm font-medium">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border-2 border-magical-pink rounded-full
                         hover:bg-magical-pink/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                disabled={!newBoardName}
                className={`flex-1 magical-button ${
                  !newBoardName && 'opacity-50 cursor-not-allowed'
                }`}
              >
                Create ✨
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}