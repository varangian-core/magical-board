'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditBoardModalProps {
  board: {
    id: string
    name: string
    description?: string
  }
  onClose: () => void
  onSave: (id: string, name: string, description?: string) => void
}

export default function EditBoardModal({ board, onClose, onSave }: EditBoardModalProps) {
  const [name, setName] = useState(board.name)
  const [description, setDescription] = useState(board.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(board.id, name.trim(), description.trim() || undefined)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">✏️</span>
            Edit Board
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                Board Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/40 
                         focus:bg-white/15 transition-all"
                placeholder="Enter board name..."
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/40 
                         focus:bg-white/15 transition-all resize-none"
                placeholder="Describe your board..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                         text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Save Changes
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}