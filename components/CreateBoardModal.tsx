'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Kingdom } from '@/lib/kingdoms'
import boardStorage from '@/lib/boardStorage'
import userStorage from '@/lib/userStorage'

interface CreateBoardModalProps {
  kingdom: Kingdom
  onClose: () => void
  onCreate: (name: string, description?: string) => void
}

export default function CreateBoardModal({ kingdom, onClose, onCreate }: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState('')
  const [boardDescription, setBoardDescription] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (boardName.trim()) {
      onCreate(boardName.trim(), boardDescription.trim() || undefined)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="magical-card p-8 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{kingdom.icon}</span>
          <h2 className="text-2xl font-bold magical-gradient-text">
            New {kingdom.name} Board
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-magical-purple mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter a magical name..."
              className="w-full px-4 py-3 rounded-lg border-2 border-magical-pink/30 
                       focus:border-magical-purple focus:outline-none focus:ring-2 
                       focus:ring-magical-purple/20 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-magical-purple mb-2">
              Description (optional)
            </label>
            <textarea
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              placeholder="What magical adventures await..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-magical-pink/30 
                       focus:border-magical-purple focus:outline-none focus:ring-2 
                       focus:ring-magical-purple/20 transition-all resize-none"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-magical-pink rounded-full
                       hover:bg-magical-pink/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!boardName.trim()}
              className={`flex-1 magical-button ${
                !boardName.trim() && 'opacity-50 cursor-not-allowed'
              }`}
            >
              Create Board ✨
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}