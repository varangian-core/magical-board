'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const magicalAvatars = [
  { id: 'moon', name: 'Moon Guardian', emoji: '🌙', color: '#FFB6E1' },
  { id: 'star', name: 'Star Guardian', emoji: '⭐', color: '#DDA0DD' },
  { id: 'heart', name: 'Heart Guardian', emoji: '💖', color: '#FF69B4' },
  { id: 'crystal', name: 'Crystal Guardian', emoji: '💎', color: '#B0E0E6' },
  { id: 'flower', name: 'Flower Guardian', emoji: '🌸', color: '#FFB6C1' },
  { id: 'rainbow', name: 'Rainbow Guardian', emoji: '🌈', color: '#FF6347' },
]

interface UserSelectionProps {
  onUserSelect: (user: any) => void
  onUserCreate: (name: string, avatar: any) => void
  onClose: () => void
  existingUsers: any[]
}

export default function UserSelection({ onUserSelect, onUserCreate, onClose, existingUsers }: UserSelectionProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(existingUsers.length === 0)
  const [userName, setUserName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<typeof magicalAvatars[0] | null>(null)

  const handleCreateUser = () => {
    if (userName && selectedAvatar) {
      onUserCreate(userName, selectedAvatar)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
      >
        <motion.button
          onClick={onClose}
          whileHover={{ rotate: 90 }}
          className="absolute top-4 right-4 text-2xl text-white/80 hover:text-white transition-colors"
        >
          ✖️
        </motion.button>

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {isCreatingNew ? 'Create Your Guardian' : 'Choose Your Guardian'}
        </h1>

        {!isCreatingNew && existingUsers.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Existing Guardians
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingUsers.map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUserSelect(user)}
                    className="p-4 rounded-xl border-2 border-white/20 
                             hover:border-white/40 bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <div className="text-3xl mb-1">{user.avatar.emoji}</div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-white/60">{user.avatar.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center my-6">
              <motion.button
                onClick={() => setIsCreatingNew(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Create New Guardian ✨
              </motion.button>
            </div>
          </>
        )}

        {isCreatingNew && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Guardian Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your magical name..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:border-white/40 
                         focus:bg-white/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">
                Select Your Avatar
              </label>
              <div className="grid grid-cols-3 gap-4">
                {magicalAvatars.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer
                      ${selectedAvatar?.id === avatar.id
                        ? 'border-white/60 bg-white/20 shadow-lg'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                      }`}
                  >
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="text-sm font-medium text-white">{avatar.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {existingUsers.length > 0 && (
                <motion.button
                  onClick={() => setIsCreatingNew(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 
                           text-white rounded-lg font-medium transition-all"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: (!userName || !selectedAvatar) ? 1 : 1.02 }}
                whileTap={{ scale: (!userName || !selectedAvatar) ? 1 : 0.98 }}
                onClick={handleCreateUser}
                disabled={!userName || !selectedAvatar}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all
                  ${(userName && selectedAvatar) 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
              >
                Transform into Guardian ✨
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}