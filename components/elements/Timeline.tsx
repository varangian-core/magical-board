import { useState, useEffect } from 'react'
import { Group, Rect, Text, Circle, Line } from 'react-konva'
import { BoardElement } from '@/store/boardStore'
import useBoardStore from '@/store/boardStore'
import { nanoid } from 'nanoid'
import { TimelineNode } from '@/lib/timelineTemplates'

interface TimelineProps {
  element: BoardElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
}

export default function Timeline({ element, isSelected, onSelect, onDragEnd }: TimelineProps) {
  const { updateElement, deleteElement } = useBoardStore()
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'date' | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [draggingMilestone, setDraggingMilestone] = useState<string | null>(null)
  
  const content = element.content
  const nodes: TimelineNode[] = content.nodes || []
  const userColor = content.userColor || '#DDA0DD'
  const timelineTitle = content.template?.name || 'Timeline'
  const style = content.template?.style || 'vertical'
  
  // Calculate dynamic size based on nodes
  const calculateTimelineSize = (nodeList: TimelineNode[] = nodes) => {
    if (nodeList.length === 0) {
      return { width: 600, height: 400 }
    }
    
    let maxX = 0
    let maxY = 0
    
    nodeList.forEach(node => {
      // Account for node size
      const nodeWidth = node.type === 'time' ? 120 : 50
      const nodeHeight = node.type === 'time' ? 60 : 50
      
      maxX = Math.max(maxX, node.x + nodeWidth / 2)
      maxY = Math.max(maxY, node.y + nodeHeight / 2)
    })
    
    // Add padding and header space
    const padding = 100
    const headerHeight = 40
    
    return {
      width: Math.max(600, maxX + padding),
      height: Math.max(400, maxY + padding + headerHeight)
    }
  }
  
  const timelineSize = calculateTimelineSize()

  const handleDelete = (e: any) => {
    e.cancelBubble = true
    deleteElement(element.id)
  }

  const handleNodeEdit = (nodeId: string, field: 'title' | 'date', value: string) => {
    const updatedNodes = nodes.map((node: TimelineNode) => 
      node.id === nodeId ? { ...node, [field]: value } : node
    )
    updateElement(element.id, {
      content: { ...content, nodes: updatedNodes }
    })
  }

  const getNewNodePosition = () => {
    if (nodes.length === 0) {
      // Start from top-left with some padding
      return { x: 80, y: 80 }
    }
    
    const lastNode = nodes[nodes.length - 1]
    
    if (style === 'vertical') {
      // Place new node below the last one
      return { x: lastNode.x, y: lastNode.y + 100 }
    } else if (style === 'horizontal') {
      // Place new node to the right of the last one
      return { x: lastNode.x + 150, y: lastNode.y }
    } else {
      // Branching: alternate left and right
      const parentNode = nodes[Math.floor((nodes.length - 1) / 2)]
      const isLeft = nodes.length % 2 === 0
      return {
        x: parentNode ? parentNode.x + (isLeft ? -80 : 80) : 80,
        y: parentNode ? parentNode.y + 100 : 80
      }
    }
  }

  const handleAddTimeNode = () => {
    const position = getNewNodePosition()
    const newNode: TimelineNode = {
      id: nanoid(),
      x: position.x,
      y: position.y,
      title: 'Time Point',
      date: `Day ${nodes.filter(n => n.type === 'time').length + 1}`,
      icon: '🕐',
      color: userColor,
      type: 'time',
      connections: []
    }
    
    // Auto-connect to previous node if exists
    if (nodes.length > 0 && (style === 'vertical' || style === 'horizontal')) {
      const lastNode = nodes[nodes.length - 1]
      const updatedNodes = nodes.map(node => 
        node.id === lastNode.id 
          ? { ...node, connections: [...node.connections, newNode.id] }
          : node
      )
      const allNodes = [...updatedNodes, newNode]
      const newSize = calculateTimelineSize(allNodes)
      updateElement(element.id, {
        content: { ...content, nodes: allNodes },
        size: newSize
      })
    } else {
      const allNodes = [...nodes, newNode]
      const newSize = calculateTimelineSize(allNodes)
      updateElement(element.id, {
        content: { ...content, nodes: allNodes },
        size: newSize
      })
    }
  }

  const handleAddMilestone = () => {
    // Place milestone offset from last node
    const basePosition = getNewNodePosition()
    const offset = style === 'horizontal' ? { x: 0, y: 60 } : { x: 80, y: 0 }
    
    const newNode: TimelineNode = {
      id: nanoid(),
      x: basePosition.x + offset.x,
      y: basePosition.y + offset.y,
      title: 'Milestone',
      date: '',
      icon: '⭐',
      color: userColor,
      type: 'milestone',
      connections: []
    }
    
    const allNodes = [...nodes, newNode]
    const newSize = calculateTimelineSize(allNodes)
    updateElement(element.id, {
      content: { ...content, nodes: allNodes },
      size: newSize
    })
  }

  const handleNodeDrag = (nodeId: string, e: any) => {
    const draggedNode = nodes.find(n => n.id === nodeId)
    if (!draggedNode) return
    
    let updatedNodes = nodes.map((node: TimelineNode) => 
      node.id === nodeId 
        ? { ...node, x: e.target.x(), y: e.target.y() }
        : node
    )
    
    // Handle milestone snapping
    if (draggedNode.type === 'milestone') {
      const snapDistance = 50
      let closestTimeNode: TimelineNode | null = null
      let minDistance = snapDistance
      
      // Find closest time node
      nodes.forEach(node => {
        if (node.type === 'time') {
          const distance = Math.sqrt(
            Math.pow(e.target.x() - node.x, 2) + 
            Math.pow(e.target.y() - node.y, 2)
          )
          if (distance < minDistance) {
            minDistance = distance
            closestTimeNode = node
          }
        }
      })
      
      // Update snap relationship
      updatedNodes = updatedNodes.map(node => 
        node.id === nodeId
          ? { ...node, snapTo: closestTimeNode?.id }
          : node
      )
    }
    
    // Recalculate size after node drag
    const newSize = calculateTimelineSize(updatedNodes)
    
    updateElement(element.id, {
      content: { ...content, nodes: updatedNodes },
      size: newSize
    })
  }

  const handleConnect = (nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      // Only allow connections from time nodes
      const fromNode = nodes.find(n => n.id === connectingFrom)
      if (fromNode?.type === 'time') {
        const updatedNodes = nodes.map((node: TimelineNode) => 
          node.id === connectingFrom 
            ? { ...node, connections: [...node.connections, nodeId] }
            : node
        )
        updateElement(element.id, {
          content: { ...content, nodes: updatedNodes }
        })
      }
      setConnectingFrom(null)
    } else {
      setConnectingFrom(nodeId)
    }
  }

  const handleTitleEdit = (value: string) => {
    updateElement(element.id, {
      content: { 
        ...content, 
        template: { 
          ...content.template, 
          name: value 
        } 
      }
    })
  }

  // Edit handlers
  useEffect(() => {
    if (editingNode && editingField) {
      const node = nodes.find((n: TimelineNode) => n.id === editingNode)
      if (!node) return

      const input = document.createElement('input')
      input.value = node[editingField]
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
        handleNodeEdit(editingNode, editingField, input.value)
        setEditingNode(null)
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
  }, [editingNode, editingField])

  useEffect(() => {
    if (editingTitle) {
      const input = document.createElement('input')
      input.value = content.template?.name || 'Timeline'
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
        handleTitleEdit(input.value)
        setEditingTitle(false)
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
  }, [editingTitle])

  const drawConnection = (fromNode: TimelineNode, toNodeId: string) => {
    const toNode = nodes.find((n: TimelineNode) => n.id === toNodeId)
    if (!toNode) return null

    // Determine connection points based on node types
    const getNodeConnectionPoint = (node: TimelineNode, isFrom: boolean, style: string) => {
      if (node.type === 'time') {
        // Time node card dimensions: 120x60, centered at node position
        if (style === 'vertical') {
          return {
            x: node.x,
            y: isFrom ? node.y + 35 : node.y - 25  // Bottom/top of card
          }
        } else if (style === 'horizontal') {
          return {
            x: isFrom ? node.x + 60 : node.x - 60,  // Right/left of card
            y: node.y
          }
        } else {
          // Branching
          return {
            x: node.x,
            y: isFrom ? node.y + 35 : node.y - 25
          }
        }
      } else {
        // Milestone node (circle with radius 25)
        if (style === 'vertical') {
          return {
            x: node.x,
            y: isFrom ? node.y + 25 : node.y - 25
          }
        } else if (style === 'horizontal') {
          return {
            x: isFrom ? node.x + 25 : node.x - 25,
            y: node.y
          }
        } else {
          // Branching
          return {
            x: node.x,
            y: isFrom ? node.y + 25 : node.y - 25
          }
        }
      }
    }

    const fromPoint = getNodeConnectionPoint(fromNode, true, style)
    const toPoint = getNodeConnectionPoint(toNode, false, style)

    if (style === 'vertical') {
      // Vertical: draw straight vertical line with horizontal connector
      const midY = (fromPoint.y + toPoint.y) / 2
      return (
        <Group key={`${fromNode.id}-${toNodeId}`}>
          <Line
            points={[fromPoint.x, fromPoint.y, fromPoint.x, midY]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
          <Line
            points={[fromPoint.x, midY, toPoint.x, midY]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
          <Line
            points={[toPoint.x, midY, toPoint.x, toPoint.y]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
        </Group>
      )
    } else if (style === 'horizontal') {
      // Horizontal: draw straight horizontal line with vertical connector
      const midX = (fromPoint.x + toPoint.x) / 2
      return (
        <Group key={`${fromNode.id}-${toNodeId}`}>
          <Line
            points={[fromPoint.x, fromPoint.y, midX, fromPoint.y]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
          <Line
            points={[midX, fromPoint.y, midX, toPoint.y]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
          <Line
            points={[midX, toPoint.y, toPoint.x, toPoint.y]}
            stroke={userColor}
            strokeWidth={3}
            opacity={0.5}
          />
        </Group>
      )
    } else {
      // Branching: draw curved lines for tree structure
      const controlX = (fromPoint.x + toPoint.x) / 2
      const controlY = fromPoint.y + 40
      return (
        <Line
          key={`${fromNode.id}-${toNodeId}`}
          points={[
            fromPoint.x, fromPoint.y,
            controlX, controlY,
            controlX, toPoint.y - 40,
            toPoint.x, toPoint.y
          ]}
          stroke={userColor}
          strokeWidth={3}
          opacity={0.5}
          bezier={true}
        />
      )
    }
  }

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
        width={timelineSize.width}
        height={timelineSize.height}
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
        width={timelineSize.width}
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
        onDblClick={() => setEditingTitle(true)}
      />

      {/* Timeline icon */}
      <Text
        x={timelineSize.width - 100}
        y={10}
        text={content.template?.icon || '📅'}
        fontSize={20}
      />

      {/* Close button */}
      <Group
        x={timelineSize.width - 30}
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
          fill={userColor}
        />
      </Group>

      {/* Draw connections */}
      {nodes.map((node: TimelineNode) => 
        node.connections.map(connId => drawConnection(node, connId))
      )}
      
      {/* Draw milestone snap lines */}
      {nodes.filter(n => n.type === 'milestone' && n.snapTo).map(milestone => {
        const timeNode = nodes.find(n => n.id === milestone.snapTo)
        if (!timeNode) return null
        
        return (
          <Line
            key={`snap-${milestone.id}`}
            points={[
              timeNode.x,
              timeNode.y,
              milestone.x,
              milestone.y
            ]}
            stroke={userColor}
            strokeWidth={2}
            opacity={0.3}
            dash={[5, 5]}
          />
        )
      })}

      {/* Draw nodes */}
      {nodes.map((node: TimelineNode) => {
        if (node.type === 'time') {
          // Time node with custom card design
          return (
            <Group
              key={node.id}
              x={node.x}
              y={node.y}
              draggable
              onDragStart={() => {
                if (node.type === 'milestone') {
                  setDraggingMilestone(node.id)
                }
              }}
              onDragEnd={(e) => {
                handleNodeDrag(node.id, e)
                setDraggingMilestone(null)
              }}
              onClick={(e) => {
                e.cancelBubble = true
                setSelectedNode(node.id)
              }}
            >
              {/* Time card background */}
              <Rect
                x={-60}
                y={-25}
                width={120}
                height={60}
                fill="white"
                cornerRadius={8}
                shadowColor={userColor}
                shadowBlur={selectedNode === node.id ? 15 : 8}
                shadowOpacity={0.3}
                stroke={selectedNode === node.id || connectingFrom === node.id || (draggingMilestone && nodes.find(n => n.id === draggingMilestone)?.snapTo === node.id) ? userColor : '#E0E0E0'}
                strokeWidth={selectedNode === node.id || (draggingMilestone && nodes.find(n => n.id === draggingMilestone)?.snapTo === node.id) ? 3 : 1}
              />
              
              {/* Time header */}
              <Rect
                x={-60}
                y={-25}
                width={120}
                height={25}
                fill={userColor}
                cornerRadius={[8, 8, 0, 0]}
                opacity={0.3}
              />
              
              {/* Time icon */}
              <Text
                x={-50}
                y={-12}
                text={node.icon}
                fontSize={16}
                align="center"
                verticalAlign="middle"
              />
              
              {/* Time date */}
              <Text
                x={-20}
                y={-12}
                text={node.date}
                fontSize={12}
                fontStyle="bold"
                fill="#333"
                width={70}
                align="center"
                verticalAlign="middle"
                onDblClick={() => {
                  setEditingNode(node.id)
                  setEditingField('date')
                }}
              />
              
              {/* Time title */}
              <Text
                x={0}
                y={12}
                text={node.title}
                fontSize={11}
                align="center"
                width={100}
                offsetX={50}
                fill="#666"
                onDblClick={() => {
                  setEditingNode(node.id)
                  setEditingField('title')
                }}
              />

              {/* Connect button */}
              {selectedNode === node.id && (
                <Group
                  x={50}
                  y={-40}
                  onClick={(e) => {
                    e.cancelBubble = true
                    handleConnect(node.id)
                  }}
                >
                  <Circle
                    radius={12}
                    fill={connectingFrom === node.id ? '#4CAF50' : '#2196F3'}
                    opacity={0.8}
                  />
                  <Text
                    x={0}
                    y={0}
                    text="🔗"
                    fontSize={12}
                    align="center"
                    verticalAlign="middle"
                    offsetX={6}
                    offsetY={6}
                  />
                </Group>
              )}
            </Group>
          )
        } else {
          // Milestone node (circular)
          return (
            <Group
              key={node.id}
              x={node.x}
              y={node.y}
              draggable
              onDragStart={() => {
                if (node.type === 'milestone') {
                  setDraggingMilestone(node.id)
                }
              }}
              onDragEnd={(e) => {
                handleNodeDrag(node.id, e)
                setDraggingMilestone(null)
              }}
              onClick={(e) => {
                e.cancelBubble = true
                setSelectedNode(node.id)
              }}
            >
              {/* Node circle */}
              <Circle
                radius={25}
                fill={node.color}
                shadowBlur={selectedNode === node.id ? 10 : 5}
                shadowOpacity={0.3}
                stroke={selectedNode === node.id || connectingFrom === node.id ? '#333' : 'transparent'}
                strokeWidth={2}
              />
              
              {/* Node icon */}
              <Text
                x={0}
                y={0}
                text={node.icon}
                fontSize={20}
                align="center"
                verticalAlign="middle"
                offsetX={10}
                offsetY={10}
              />
              
              {/* Node title with background for milestone */}
              <Group>
                <Rect
                  x={-50}
                  y={30}
                  width={100}
                  height={25}
                  fill="white"
                  cornerRadius={4}
                  stroke={userColor}
                  strokeWidth={1}
                  opacity={0.9}
                />
                <Text
                  x={0}
                  y={42}
                  text={node.title}
                  fontSize={12}
                  align="center"
                  width={100}
                  offsetX={50}
                  fill="#333"
                  onDblClick={() => {
                    setEditingNode(node.id)
                    setEditingField('title')
                  }}
                />
              </Group>

              {/* Connect button */}
              {selectedNode === node.id && (
                <Group
                  x={30}
                  y={-30}
                  onClick={(e) => {
                    e.cancelBubble = true
                    handleConnect(node.id)
                  }}
                >
                  <Circle
                    radius={12}
                    fill={connectingFrom === node.id ? '#4CAF50' : '#2196F3'}
                    opacity={0.8}
                  />
                  <Text
                    x={0}
                    y={0}
                    text="🔗"
                    fontSize={12}
                    align="center"
                    verticalAlign="middle"
                    offsetX={6}
                    offsetY={6}
                  />
                </Group>
              )}
            </Group>
          )
        }
      })}

      {/* Add time node button */}
      <Group
        x={timelineSize.width - 120}
        y={timelineSize.height - 60}
        onClick={(e) => {
          e.cancelBubble = true
          handleAddTimeNode()
        }}
      >
        <Rect
          width={50}
          height={30}
          fill={userColor}
          opacity={0.2}
          stroke={userColor}
          strokeWidth={2}
          cornerRadius={15}
        />
        <Text
          x={25}
          y={15}
          text="🕐 Time"
          fontSize={12}
          align="center"
          verticalAlign="middle"
          offsetX={20}
          offsetY={6}
          fill={userColor}
        />
      </Group>

      {/* Add milestone button */}
      <Group
        x={timelineSize.width - 60}
        y={timelineSize.height - 60}
        onClick={(e) => {
          e.cancelBubble = true
          handleAddMilestone()
        }}
      >
        <Rect
          width={50}
          height={30}
          fill={userColor}
          opacity={0.2}
          stroke={userColor}
          strokeWidth={2}
          cornerRadius={15}
        />
        <Text
          x={25}
          y={15}
          text="⭐ Mile"
          fontSize={12}
          align="center"
          verticalAlign="middle"
          offsetX={20}
          offsetY={6}
          fill={userColor}
        />
      </Group>
    </Group>
  )
}