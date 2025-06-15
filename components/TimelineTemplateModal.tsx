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
          events: selectedTemplate.events,
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
                    <p className="text-xs font-medium text-magical-purple">Preview:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.events.slice(0, 3).map((event, idx) => (
                        <div 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-magical-pink/20"
                        >
                          {event.icon} {event.title}
                        </div>
                      ))}
                      {template.events.length > 3 && (
                        <div className="text-xs px-2 py-1 text-gray-500">
                          +{template.events.length - 3} more
                        </div>
                      )}
                    </div>
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
                  {selectedTemplate.icon} {selectedTemplate.name} Events
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {selectedTemplate.events.map((event) => (
                    <div 
                      key={event.id}
                      className="p-3 rounded-lg border border-magical-pink/30"
                      style={{ borderColor: event.color + '40' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{event.icon}</span>
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{event.date}</p>
                    </div>
                  ))}
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