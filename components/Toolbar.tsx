'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import useBoardStore from '@/store/boardStore'
import ImageUploadModal from './ImageUploadModal'
import ImageManager from './ImageManager'

const tools = [
  { id: 'card', name: 'Card', emoji: '📝', color: '#FFB6E1' },
  { id: 'image', name: 'Image', emoji: '🖼️', color: '#DDA0DD' },
  { id: 'timeline', name: 'Timeline', emoji: '📅', color: '#B0E0E6' },
]

interface ToolbarProps {
  boardId: string
}

export default function Toolbar({ boardId }: ToolbarProps) {
  const { addElement } = useBoardStore()
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showImageManager, setShowImageManager] = useState(false)

  const handleAddElement = (type: 'card' | 'image' | 'timeline') => {
    if (type === 'image') {
      setShowImageUpload(true)
      return
    }

    const randomX = Math.random() * (window.innerWidth - 300)
    const randomY = Math.random() * (window.innerHeight - 200)

    addElement({
      type,
      position: { x: randomX, y: randomY },
    })
  }

  return (
    <>
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="magical-card px-6 py-4 flex gap-4"
        >
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddElement(tool.id as any)}
              className="group relative"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center
                           bg-white shadow-lg group-hover:shadow-xl transition-all
                           group-hover:bg-gradient-to-br from-magical-pink to-magical-purple"
                style={{ borderColor: tool.color, borderWidth: 2 }}
              >
                <span className="text-2xl">{tool.emoji}</span>
              </div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2
                             text-xs font-medium opacity-0 group-hover:opacity-100
                             transition-opacity whitespace-nowrap">
                {tool.name}
              </span>
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowImageManager(true)}
            className="group relative ml-4"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center
                         bg-white shadow-lg group-hover:shadow-xl transition-all
                         group-hover:bg-gradient-to-br from-sparkle-gold to-sparkle-silver"
              style={{ borderColor: '#FFD700', borderWidth: 2 }}
            >
              <span className="text-2xl">🗂️</span>
            </div>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2
                           text-xs font-medium opacity-0 group-hover:opacity-100
                           transition-opacity whitespace-nowrap">
              Gallery
            </span>
          </motion.button>
        </motion.div>
      </div>

      <ImageUploadModal 
        isOpen={showImageUpload} 
        onClose={() => setShowImageUpload(false)} 
      />
      
      <ImageManager
        boardId={boardId}
        isOpen={showImageManager}
        onClose={() => setShowImageManager(false)}
      />
    </>
  )
}