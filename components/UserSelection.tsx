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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="magical-card p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl hover:rotate-90 transition-transform"
        >
          ✖️
        </button>

        <h1 className="text-3xl font-bold text-center magical-gradient-text mb-6">
          {isCreatingNew ? 'Create Your Guardian' : 'Choose Your Guardian'}
        </h1>

        {!isCreatingNew && existingUsers.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-magical-purple mb-4">
                Existing Guardians
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingUsers.map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUserSelect(user)}
                    className="p-4 rounded-xl border-2 border-magical-pink/30 
                             hover:border-magical-purple bg-white/50 transition-all"
                  >
                    <div className="text-3xl mb-1">{user.avatar.emoji}</div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-600">{user.avatar.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center my-6">
              <button
                onClick={() => setIsCreatingNew(true)}
                className="magical-button"
              >
                Create New Guardian ✨
              </button>
            </div>
          </>
        )}

        {isCreatingNew && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-magical-purple mb-2">
                Guardian Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your magical name..."
                className="w-full px-4 py-3 rounded-lg border-2 border-magical-pink/30 
                         focus:border-magical-purple focus:outline-none focus:ring-2 
                         focus:ring-magical-purple/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-magical-purple mb-4">
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
                        ? 'border-magical-purple bg-magical-purple/10 shadow-lg'
                        : 'border-magical-pink/30 hover:border-magical-pink'
                      }`}
                  >
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="text-sm font-medium">{avatar.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {existingUsers.length > 0 && (
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 px-4 py-2 border-2 border-magical-pink rounded-full
                           hover:bg-magical-pink/10 transition-all"
                >
                  Back
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateUser}
                disabled={!userName || !selectedAvatar}
                className={`flex-1 magical-button ${
                  (!userName || !selectedAvatar) && 'opacity-50 cursor-not-allowed'
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