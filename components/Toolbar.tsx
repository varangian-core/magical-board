'use client'

import { motion } from 'framer-motion'
import useBoardStore from '@/store/boardStore'

const tools = [
  { id: 'card', name: 'Card', emoji: '📝', color: '#FFB6E1' },
  { id: 'image', name: 'Image', emoji: '🖼️', color: '#DDA0DD' },
  { id: 'timeline', name: 'Timeline', emoji: '📅', color: '#B0E0E6' },
]

export default function Toolbar() {
  const { addElement } = useBoardStore()

  const handleAddElement = (type: 'card' | 'image' | 'timeline') => {
    const randomX = Math.random() * (window.innerWidth - 300)
    const randomY = Math.random() * (window.innerHeight - 200)

    addElement({
      type,
      position: { x: randomX, y: randomY },
      content: type === 'card' 
        ? { text: 'New Magical Card ✨', color: '#FFB6E1' }
        : type === 'timeline'
        ? { events: [] }
        : { url: '' },
    })
  }

  return (
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
      </motion.div>
    </div>
  )
}