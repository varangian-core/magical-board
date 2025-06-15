import { Group, Rect, Text } from 'react-konva'
import { BoardElement } from '@/store/boardStore'

interface CardProps {
  element: BoardElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
}

export default function Card({ element, isSelected, onSelect, onDragEnd }: CardProps) {
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
        fill={element.content.color || '#FFB6E1'}
        cornerRadius={16}
        shadowColor="#DDA0DD"
        shadowBlur={isSelected ? 20 : 10}
        shadowOpacity={0.3}
        stroke={isSelected ? '#DDA0DD' : 'transparent'}
        strokeWidth={isSelected ? 3 : 0}
      />
      <Text
        text={element.content.text || 'Card'}
        x={20}
        y={20}
        fontSize={16}
        fontFamily="Inter"
        fill="#333"
        width={element.size.width - 40}
        height={element.size.height - 40}
      />
    </Group>
  )
}