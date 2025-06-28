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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Choose Timeline Template ✨
              </h2>
              <motion.button
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                className="text-2xl text-white/80 hover:text-white transition-colors"
              >
                ✖️
              </motion.button>
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
                      ? 'border-white/60 bg-white/15'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{template.icon}</span>
                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  </div>
                  <p className="text-sm text-white/70 mb-4">{template.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/60">Style: {template.style}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-white/20 pt-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {selectedTemplate.icon} {selectedTemplate.name}
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Create a {selectedTemplate.style} timeline. You can add time nodes and milestones, 
                  then drag them to arrange your timeline layout.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🕐</span>
                    <span className="text-sm text-white/60">Time nodes mark specific points in time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-sm text-white/60">Milestones mark important events</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleCreateTimeline}
                disabled={!selectedTemplate}
                whileHover={{ scale: !selectedTemplate ? 1 : 1.02 }}
                whileTap={{ scale: !selectedTemplate ? 1 : 0.98 }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all
                  ${selectedTemplate 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
              >
                Create Timeline ✨
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}