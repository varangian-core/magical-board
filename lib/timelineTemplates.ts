export interface TimelineEvent {
  id: string
  title: string
  date: string
  description?: string
  icon?: string
  color?: string
}

export interface TimelineTemplate {
  id: string
  name: string
  description: string
  icon: string
  events: TimelineEvent[]
  style: 'vertical' | 'horizontal' | 'tree'
}

export const timelineTemplates: TimelineTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Timeline',
    description: 'Start with an empty timeline',
    icon: '✨',
    style: 'tree',
    events: []
  },
  {
    id: 'project-phases',
    name: 'Project Timeline',
    description: 'Simple project milestones',
    icon: '🚀',
    style: 'tree',
    events: [
      {
        id: '1',
        title: 'Start',
        date: 'Week 1',
        icon: '🌟',
        color: '#FFB6E1'
      },
      {
        id: '2',
        title: 'Middle',
        date: 'Week 2',
        icon: '⚡',
        color: '#DDA0DD'
      },
      {
        id: '3',
        title: 'End',
        date: 'Week 3',
        icon: '🎉',
        color: '#B0E0E6'
      }
    ]
  },
  {
    id: 'magical-journey',
    name: 'Story Arc',
    description: 'Character journey timeline',
    icon: '🌙',
    style: 'tree',
    events: [
      {
        id: '1',
        title: 'Beginning',
        date: 'Chapter 1',
        icon: '💫',
        color: '#FFB6E1'
      },
      {
        id: '2',
        title: 'Rising Action',
        date: 'Chapter 2',
        icon: '🌟',
        color: '#DDA0DD'
      },
      {
        id: '3',
        title: 'Climax',
        date: 'Chapter 3',
        icon: '⚡',
        color: '#FF69B4'
      },
      {
        id: '4',
        title: 'Resolution',
        date: 'Chapter 4',
        icon: '👑',
        color: '#FFD700'
      }
    ]
  }
]