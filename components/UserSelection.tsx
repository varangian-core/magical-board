'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'

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
}

export default function UserSelection({ onUserSelect }: UserSelectionProps) {
  const [userName, setUserName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<typeof magicalAvatars[0] | null>(null)

  const handleCreateUser = () => {
    if (userName && selectedAvatar) {
      const user = {
        id: nanoid(),
        name: userName,
        avatar: selectedAvatar,
        color: selectedAvatar.color,
        createdAt: new Date(),
      }
      onUserSelect(user)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-starry flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="magical-card p-8 max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-center magical-gradient-text mb-8">
          Choose Your Guardian
        </h1>

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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateUser}
            disabled={!userName || !selectedAvatar}
            className={`w-full magical-button ${
              (!userName || !selectedAvatar) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Transform into Guardian ✨
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}