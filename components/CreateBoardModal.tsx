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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-50"
         onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl max-w-md w-full shadow-2xl border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{kingdom.emoji}</span>
          <h2 className="text-2xl font-bold text-white">
            New {kingdom.name} Board
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter a magical name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-white/50 focus:outline-none focus:border-white/40 
                       focus:bg-white/15 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description (optional)
            </label>
            <textarea
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              placeholder="What magical adventures await..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-white/50 focus:outline-none focus:border-white/40 
                       focus:bg-white/15 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 
                       text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={!boardName.trim()}
              whileHover={{ scale: !boardName.trim() ? 1 : 1.02 }}
              whileTap={{ scale: !boardName.trim() ? 1 : 0.98 }}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all
                ${boardName.trim() 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
            >
              Create Board ✨
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}