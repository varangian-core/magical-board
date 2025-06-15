export interface TimelineEvent {
  id: string
  title: string
  date: string
  description?: string
  icon?: string
  color?: string
}

export interface TimelineNode {
  id: string
  x: number
  y: number
  title: string
  date: string
  icon: string
  color: string
  type: 'time' | 'milestone'
  connections: string[] // IDs of connected nodes
  snapTo?: string // ID of time node this milestone snaps to
}

export interface TimelineTemplate {
  id: string
  name: string
  description: string
  icon: string
  style: 'vertical' | 'horizontal' | 'branching'
  nodes: TimelineNode[]
}

export const timelineTemplates: TimelineTemplate[] = [
  {
    id: 'vertical',
    name: 'Vertical Timeline',
    description: 'Simple vertical flow',
    icon: '⬇️',
    style: 'vertical',
    nodes: []
  },
  {
    id: 'horizontal',
    name: 'Horizontal Timeline',
    description: 'Left to right flow',
    icon: '➡️',
    style: 'horizontal',
    nodes: []
  },
  {
    id: 'branching',
    name: 'Branching Timeline',
    description: 'Tree with diagonal branches',
    icon: '🌳',
    style: 'branching',
    nodes: []
  }
]