'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineTemplates, TimelineTemplate } from '@/lib/timelineTemplates'
import useBoardStore from '@/store/boardStore'

interface TimelineTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
}

export default function TimelineTemplateModal({ isOpen, onClose, position }: TimelineTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TimelineTemplate | null>(null)
  const { addElement, currentUser } = useBoardStore()

  const handleCreateTimeline = () => {
    if (selectedTemplate && currentUser) {
      addElement({
        type: 'timeline',
        position,
        size: { width: 600, height: 400 },
        content: {
          template: selectedTemplate,
          nodes: selectedTemplate.nodes || [],
          style: selectedTemplate.style,
          userColor: currentUser.avatar.color
        }
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="magical-card p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold magical-gradient-text">
                Choose Timeline Template ✨
              </h2>
              <button
                onClick={onClose}
                className="text-2xl hover:rotate-90 transition-transform"
              >
                ✖️
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 max-h-[50vh] overflow-y-auto">
              {timelineTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedTemplate?.id === template.id
                      ? 'border-magical-purple bg-magical-purple/10'
                      : 'border-magical-pink/30 hover:border-magical-pink'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{template.icon}</span>
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-magical-purple">Style: {template.style}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t pt-6"
              >
                <h3 className="text-lg font-semibold mb-3">
                  {selectedTemplate.icon} {selectedTemplate.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a {selectedTemplate.style} timeline. You can add time nodes and milestones, 
                  then drag them to arrange your timeline layout.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🕐</span>
                    <span className="text-sm">Time nodes mark specific points in time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-sm">Milestones mark important events</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-magical-pink rounded-full
                         hover:bg-magical-pink/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTimeline}
                disabled={!selectedTemplate}
                className={`flex-1 magical-button ${
                  !selectedTemplate && 'opacity-50 cursor-not-allowed'
                }`}
              >
                Create Timeline ✨
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}