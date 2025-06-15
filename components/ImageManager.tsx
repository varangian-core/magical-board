'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import imageStorage from '@/lib/imageStorage'

interface ImageManagerProps {
  boardId: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageManager({ boardId, isOpen, onClose }: ImageManagerProps) {
  const [images, setImages] = useState<any[]>([])
  const [storageInfo, setStorageInfo] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen, boardId])

  const loadImages = () => {
    const boardImages = imageStorage.getImagesByBoard(boardId)
    setImages(boardImages)
    setStorageInfo(imageStorage.getStorageInfo())
  }

  const handleDeleteImage = (imageId: string) => {
    imageStorage.deleteImage(imageId)
    loadImages()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
                Image Gallery 🌟
              </h2>
              <button
                onClick={onClose}
                className="text-2xl hover:rotate-90 transition-transform"
              >
                ✖️
              </button>
            </div>

            {storageInfo && (
              <div className="mb-6 p-4 bg-magical-pink/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-magical-purple">
                    Storage Usage
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.limit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${storageInfo.percentage}%` }}
                    className="h-full bg-gradient-magical rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {images.length} images stored
                </p>
              </div>
            )}

            {images.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-lg text-magical-purple">
                  No images uploaded yet!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[50vh]">
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative group"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-40 object-cover rounded-lg border-2 
                               border-magical-pink/30 group-hover:border-magical-purple
                               transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 
                                  to-transparent opacity-0 group-hover:opacity-100 
                                  transition-opacity rounded-lg">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs truncate">{img.name}</p>
                        <p className="text-white/70 text-xs">
                          {formatFileSize(img.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white 
                                 rounded-full w-8 h-8 flex items-center justify-center
                                 hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}