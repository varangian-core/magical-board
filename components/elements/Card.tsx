import { useState, useRef, useEffect } from 'react'
import { Group, Rect, Text, Circle } from 'react-konva'
import { BoardElement, CardContent } from '@/store/boardStore'
import useBoardStore from '@/store/boardStore'

interface CardProps {
  element: BoardElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
}

export default function Card({ element, isSelected, onSelect, onDragEnd }: CardProps) {
  const { updateElement, deleteElement } = useBoardStore()
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const [headerText, setHeaderText] = useState((element.content as CardContent).header)
  const [mainText, setMainText] = useState((element.content as CardContent).text)
  
  const content = element.content as CardContent

  const handleDelete = (e: any) => {
    e.cancelBubble = true
    deleteElement(element.id)
  }

  const handleHeaderDblClick = () => {
    setIsEditingHeader(true)
  }

  const handleTextDblClick = () => {
    setIsEditingText(true)
  }

  const handleHeaderChange = (newText: string) => {
    setHeaderText(newText)
    updateElement(element.id, {
      content: { ...content, header: newText }
    })
  }

  const handleTextChange = (newText: string) => {
    setMainText(newText)
    updateElement(element.id, {
      content: { ...content, text: newText }
    })
  }

  useEffect(() => {
    if (isEditingHeader) {
      const input = document.createElement('input')
      input.value = headerText
      input.style.position = 'fixed'
      input.style.top = '50%'
      input.style.left = '50%'
      input.style.transform = 'translate(-50%, -50%)'
      input.style.fontSize = '18px'
      input.style.padding = '8px'
      input.style.border = '2px solid #DDA0DD'
      input.style.borderRadius = '8px'
      input.style.outline = 'none'
      input.style.backgroundColor = 'white'
      input.style.zIndex = '9999'
      
      document.body.appendChild(input)
      input.focus()
      input.select()

      const handleBlur = () => {
        handleHeaderChange(input.value)
        setIsEditingHeader(false)
        if (document.body.contains(input)) {
          document.body.removeChild(input)
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          input.blur()
        }
      }

      input.addEventListener('blur', handleBlur)
      input.addEventListener('keydown', handleKeyDown)

      return () => {
        input.removeEventListener('blur', handleBlur)
        input.removeEventListener('keydown', handleKeyDown)
        if (document.body.contains(input)) {
          document.body.removeChild(input)
        }
      }
    }
  }, [isEditingHeader, headerText])

  useEffect(() => {
    if (isEditingText) {
      const textarea = document.createElement('textarea')
      textarea.value = mainText
      textarea.style.position = 'fixed'
      textarea.style.top = '50%'
      textarea.style.left = '50%'
      textarea.style.transform = 'translate(-50%, -50%)'
      textarea.style.fontSize = '16px'
      textarea.style.padding = '8px'
      textarea.style.border = '2px solid #DDA0DD'
      textarea.style.borderRadius = '8px'
      textarea.style.outline = 'none'
      textarea.style.backgroundColor = 'white'
      textarea.style.zIndex = '9999'
      textarea.style.width = '300px'
      textarea.style.height = '100px'
      textarea.style.resize = 'none'
      
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      const handleBlur = () => {
        handleTextChange(textarea.value)
        setIsEditingText(false)
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea)
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          textarea.blur()
        }
      }

      textarea.addEventListener('blur', handleBlur)
      textarea.addEventListener('keydown', handleKeyDown)

      return () => {
        textarea.removeEventListener('blur', handleBlur)
        textarea.removeEventListener('keydown', handleKeyDown)
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea)
        }
      }
    }
  }, [isEditingText, mainText])

  return (
    <Group
      x={element.position.x}
      y={element.position.y}
      draggable
      onClick={onSelect}
      onDragEnd={onDragEnd}
    >
      {/* Card background */}
      <Rect
        width={element.size.width}
        height={element.size.height}
        fill="white"
        cornerRadius={16}
        shadowColor={content.color}
        shadowBlur={isSelected ? 20 : 10}
        shadowOpacity={0.3}
        stroke={isSelected ? content.color : '#E0E0E0'}
        strokeWidth={isSelected ? 3 : 1}
      />

      {/* Header background */}
      <Rect
        width={element.size.width}
        height={50}
        fill={content.color}
        cornerRadius={[16, 16, 0, 0]}
        opacity={0.9}
      />

      {/* User icon circle */}
      <Circle
        x={25}
        y={25}
        radius={18}
        fill="white"
      />

      {/* User icon emoji */}
      <Text
        x={25}
        y={25}
        text={content.userIcon}
        fontSize={20}
        align="center"
        verticalAlign="middle"
        offsetX={10}
        offsetY={10}
      />

      {/* Header text */}
      <Text
        x={55}
        y={15}
        text={headerText}
        fontSize={18}
        fontStyle="bold"
        fill="white"
        width={element.size.width - 70}
        onDblClick={handleHeaderDblClick}
      />

      {/* User name */}
      <Text
        x={55}
        y={35}
        text={content.userName}
        fontSize={12}
        fill="white"
        opacity={0.8}
      />

      {/* Close button */}
      <Group
        x={element.size.width - 30}
        y={10}
        onClick={handleDelete}
      >
        <Circle
          radius={15}
          fill="white"
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
          fill={content.color}
        />
      </Group>

      {/* Main text */}
      <Text
        x={20}
        y={70}
        text={mainText}
        fontSize={14}
        fill="#333"
        width={element.size.width - 40}
        height={element.size.height - 90}
        onDblClick={handleTextDblClick}
        lineHeight={1.5}
      />
    </Group>
  )
}