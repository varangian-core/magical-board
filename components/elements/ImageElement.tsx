import { Group, Image as KonvaImage, Rect, Transformer, Circle, Text } from 'react-konva'
import { BoardElement } from '@/store/boardStore'
import { useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import useBoardStore from '@/store/boardStore'

interface ImageElementProps {
  element: BoardElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
  onTransformEnd: (e: any) => void
}

export default function ImageElement({ 
  element, 
  isSelected, 
  onSelect, 
  onDragEnd,
  onTransformEnd 
}: ImageElementProps) {
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const { deleteElement } = useBoardStore()

  const handleDelete = (e: any) => {
    e.cancelBubble = true
    deleteElement(element.id)
  }

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = element.content.url
    img.onload = () => {
      setImage(img)
    }
  }, [element.content.url])

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  if (!image) {
    return (
      <Group
        x={element.position.x}
        y={element.position.y}
        draggable
        onClick={onSelect}
        onDragEnd={onDragEnd}
      >
        <Rect
          width={element.size.width}
          height={element.size.height}
          fill="#F0F0F0"
          cornerRadius={16}
          stroke="#DDA0DD"
          strokeWidth={2}
          dash={[10, 5]}
        />
      </Group>
    )
  }

  return (
    <>
      <Group
        x={element.position.x}
        y={element.position.y}
        draggable
        onClick={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      >
        <KonvaImage
          ref={imageRef}
          image={image}
          width={element.size.width}
          height={element.size.height}
          cornerRadius={16}
          shadowColor="#DDA0DD"
          shadowBlur={isSelected ? 20 : 10}
          shadowOpacity={0.3}
          stroke={isSelected ? '#DDA0DD' : 'transparent'}
          strokeWidth={isSelected ? 3 : 0}
        />
        
        {/* Close button */}
        <Group
          x={element.size.width - 30}
          y={10}
          onClick={handleDelete}
        >
          <Circle
            radius={15}
            fill="#DDA0DD"
            opacity={0.9}
          />
          <Text
            x={0}
            y={0}
            text="✕"
            fontSize={16}
            align="center"
            verticalAlign="middle"
            offsetX={5}
            offsetY={8}
            fill="white"
          />
        </Group>
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox
            }
            return newBox
          }}
          anchorStroke="#DDA0DD"
          anchorFill="#FFB6E1"
          anchorSize={12}
          borderStroke="#DDA0DD"
          borderDash={[6, 3]}
          rotateEnabled={true}
          keepRatio={true}
        />
      )}
    </>
  )
}