'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva'
import Konva from 'konva'
import { motion } from 'framer-motion'
import useBoardStore from '@/store/boardStore'
import Card from './elements/Card'
import Toolbar from './Toolbar'

interface BoardCanvasProps {
  boardId: string
}

export default function BoardCanvas({ boardId }: BoardCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const { elements, addElement, updateElement, selectedElement, setSelectedElement } = useBoardStore()

  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
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

  return (
    <>
      <Toolbar />
      <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50">
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
              }
              return null
            })}
          </Layer>
        </Stage>
      </div>
    </>
  )
}