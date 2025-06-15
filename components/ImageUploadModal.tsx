'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import useBoardStore from '@/store/boardStore'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { addElement } = useBoardStore()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          setUploadedImages((prev) => [...prev, imageUrl])
          
          // Add image to board
          const imageId = nanoid()
          addElement({
            id: imageId,
            type: 'image',
            content: {
              url: imageUrl,
              name: file.name,
              size: file.size,
            },
            position: {
              x: Math.random() * (window.innerWidth - 400) + 200,
              y: Math.random() * (window.innerHeight - 400) + 200,
            },
            size: { width: 300, height: 300 },
          })
        }
        reader.readAsDataURL(file)
      }
    })
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
            className="magical-card p-8 max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold magical-gradient-text">
                Upload Magical Images ✨
              </h2>
              <button
                onClick={onClose}
                className="text-2xl hover:rotate-90 transition-transform"
              >
                ✖️
              </button>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-all
                ${isDragging 
                  ? 'border-magical-purple bg-magical-purple/10 scale-105' 
                  : 'border-magical-pink/50 hover:border-magical-pink'
                }`}
            >
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-lg font-medium text-magical-purple mb-2">
                Drag & drop your images here
              </p>
              <p className="text-sm text-gray-600 mb-6">
                or click to select files
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="magical-button inline-block cursor-pointer"
              >
                Choose Images
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-magical-purple mb-3">
                  Recently Uploaded ({uploadedImages.length})
                </h3>
                <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                  {uploadedImages.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={img}
                        alt={`Uploaded ${idx}`}
                        className="w-full h-24 object-cover rounded-lg border-2 
                                 border-magical-pink/30 group-hover:border-magical-purple
                                 transition-all"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-magical-purple/50 
                                    to-transparent opacity-0 group-hover:opacity-100 
                                    transition-opacity rounded-lg" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}