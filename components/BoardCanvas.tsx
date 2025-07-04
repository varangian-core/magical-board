'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer } from 'react-konva'
import type Konva from 'konva'
import { motion } from 'framer-motion'
import useBoardStore from '@/store/boardStore'
import userStorage from '@/lib/userStorage'
import Card from './elements/Card'
import ImageElement from './elements/ImageElement'
import Timeline from './elements/Timeline'
import Toolbar from './Toolbar'

interface BoardCanvasProps {
  boardId: string
}

export default function BoardCanvas({ boardId }: BoardCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)
  const { elements, addElement, updateElement, selectedElement, setSelectedElement, setCurrentUser } = useBoardStore()

  useEffect(() => {
    // Set current user in the store
    const currentUser = userStorage.getCurrentUser()
    if (currentUser) {
      setCurrentUser(currentUser)
    }

    const updateSize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsReady(true)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedElement(null)
    }
  }

  const handleDragEnd = (id: string, e: any) => {
    updateElement(id, {
      position: {
        x: e.target.x(),
        y: e.target.y(),
      },
    })
  }

  const handleTransformEnd = (id: string, e: any) => {
    const node = e.target
    updateElement(id, {
      size: {
        width: Math.max(50, node.width() * node.scaleX()),
        height: Math.max(50, node.height() * node.scaleY()),
      },
      rotation: node.rotation(),
      position: {
        x: node.x(),
        y: node.y(),
      },
    })
    node.scaleX(1)
    node.scaleY(1)
  }

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Toolbar boardId={boardId} />
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          className="sparkle-cursor"
        >
          <Layer>
            {elements.map((element) => {
              if (element.type === 'card') {
                return (
                  <Card
                    key={element.id}
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                    onDragEnd={(e) => handleDragEnd(element.id, e)}
                  />
                )
              } else if (element.type === 'image') {
                return (
                  <ImageElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                    onDragEnd={(e) => handleDragEnd(element.id, e)}
                    onTransformEnd={(e) => handleTransformEnd(element.id, e)}
                  />
                )
              } else if (element.type === 'timeline') {
                return (
                  <Timeline
                    key={element.id}
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                    onDragEnd={(e) => handleDragEnd(element.id, e)}
                  />
                )
              }
              return null
            })}
          </Layer>
        </Stage>
      </div>
    </>
  )
}