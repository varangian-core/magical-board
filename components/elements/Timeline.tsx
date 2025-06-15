import { useState, useEffect } from 'react'
import { Group, Rect, Text, Circle, Line } from 'react-konva'
import { BoardElement } from '@/store/boardStore'
import useBoardStore from '@/store/boardStore'
import { nanoid } from 'nanoid'

interface TimelineProps {
  element: BoardElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
}

export default function Timeline({ element, isSelected, onSelect, onDragEnd }: TimelineProps) {
  const { updateElement } = useBoardStore()
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'date' | null>(null)
  const content = element.content
  const events = content.events || []
  const userColor = content.userColor || '#DDA0DD'

  // Calculate positions for tree layout
  const calculateTreePositions = () => {
    const centerX = element.size.width / 2
    const startY = 60
    const verticalSpacing = 60
    const horizontalSpacing = 120
    
    const positions: any[] = []
    const levels: any[][] = []
    
    // Simple tree layout - arrange in levels
    events.forEach((event: any, index: number) => {
      const level = Math.floor(index / 2)
      if (!levels[level]) levels[level] = []
      levels[level].push({ event, index })
    })

    levels.forEach((level, levelIndex) => {
      const levelWidth = (level.length - 1) * horizontalSpacing
      const startX = centerX - levelWidth / 2
      
      level.forEach((item, itemIndex) => {
        positions[item.index] = {
          x: startX + itemIndex * horizontalSpacing,
          y: startY + levelIndex * verticalSpacing
        }
      })
    })

    return positions
  }

  const positions = calculateTreePositions()

  const handleEventEdit = (eventId: string, field: 'title' | 'date', value: string) => {
    const updatedEvents = events.map((event: any) => 
      event.id === eventId ? { ...event, [field]: value } : event
    )
    updateElement(element.id, {
      content: { ...content, events: updatedEvents }
    })
  }

  const handleAddEvent = () => {
    const newEvent = {
      id: nanoid(),
      title: 'New Event',
      date: 'Date',
      icon: '⭐',
      color: userColor
    }
    updateElement(element.id, {
      content: { ...content, events: [...events, newEvent] }
    })
  }

  useEffect(() => {
    if (editingEvent && editingField) {
      const event = events.find((e: any) => e.id === editingEvent)
      if (!event) return

      const input = document.createElement('input')
      input.value = event[editingField]
      input.style.position = 'fixed'
      input.style.top = '50%'
      input.style.left = '50%'
      input.style.transform = 'translate(-50%, -50%)'
      input.style.fontSize = '16px'
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
        handleEventEdit(editingEvent, editingField, input.value)
        setEditingEvent(null)
        setEditingField(null)
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
  }, [editingEvent, editingField])

  return (
    <Group
      x={element.position.x}
      y={element.position.y}
      draggable
      onClick={onSelect}
      onDragEnd={onDragEnd}
    >
      {/* Background */}
      <Rect
        width={element.size.width}
        height={element.size.height}
        fill="white"
        cornerRadius={16}
        shadowColor={userColor}
        shadowBlur={isSelected ? 20 : 10}
        shadowOpacity={0.3}
        stroke={isSelected ? userColor : '#E0E0E0'}
        strokeWidth={isSelected ? 3 : 1}
      />

      {/* Header */}
      <Rect
        width={element.size.width}
        height={40}
        fill={userColor}
        cornerRadius={[16, 16, 0, 0]}
        opacity={0.9}
      />

      {/* Title */}
      <Text
        x={20}
        y={12}
        text={content.template?.name || 'Timeline'}
        fontSize={16}
        fontStyle="bold"
        fill="white"
      />

      {/* Timeline icon */}
      <Text
        x={element.size.width - 40}
        y={10}
        text={content.template?.icon || '📅'}
        fontSize={20}
      />

      {/* Draw connections between events */}
      {positions.length > 1 && positions.map((pos: any, index: number) => {
        if (index === 0) return null
        const prevPos = positions[Math.floor((index - 1) / 2)]
        return (
          <Line
            key={`line-${index}`}
            points={[prevPos.x, prevPos.y + 25, pos.x, pos.y - 25]}
            stroke={userColor}
            strokeWidth={2}
            opacity={0.3}
            dash={[5, 5]}
          />
        )
      })}

      {/* Draw events */}
      {events.map((event: any, index: number) => {
        const pos = positions[index]
        if (!pos) return null

        return (
          <Group key={event.id} x={pos.x} y={pos.y}>
            {/* Event circle */}
            <Circle
              radius={25}
              fill={event.color || userColor}
              shadowBlur={5}
              shadowOpacity={0.2}
            />
            
            {/* Event icon */}
            <Text
              x={0}
              y={0}
              text={event.icon}
              fontSize={20}
              align="center"
              verticalAlign="middle"
              offsetX={10}
              offsetY={10}
            />
            
            {/* Event title */}
            <Text
              x={0}
              y={35}
              text={event.title}
              fontSize={12}
              align="center"
              width={100}
              offsetX={50}
              fill="#333"
              onDblClick={() => {
                setEditingEvent(event.id)
                setEditingField('title')
              }}
            />
            
            {/* Event date */}
            <Text
              x={0}
              y={50}
              text={event.date}
              fontSize={10}
              align="center"
              width={100}
              offsetX={50}
              fill="#666"
              fontStyle="italic"
              onDblClick={() => {
                setEditingEvent(event.id)
                setEditingField('date')
              }}
            />
          </Group>
        )
      })}

      {/* Add event button */}
      <Group
        x={element.size.width - 60}
        y={element.size.height - 60}
        onClick={(e) => {
          e.cancelBubble = true
          handleAddEvent()
        }}
      >
        <Circle
          radius={20}
          fill={userColor}
          opacity={0.2}
          stroke={userColor}
          strokeWidth={2}
        />
        <Text
          x={0}
          y={0}
          text="+"
          fontSize={24}
          align="center"
          verticalAlign="middle"
          offsetX={6}
          offsetY={12}
          fill={userColor}
        />
      </Group>
    </Group>
  )
}