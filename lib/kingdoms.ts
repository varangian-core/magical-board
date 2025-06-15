export interface Kingdom {
  id: string
  name: string
  description: string
  gradient: string
  bgImage?: string
  icon: string
  color: string
  boards: Board[]
}

export interface Board {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  userCount: number
}

export const kingdoms: Kingdom[] = [
  {
    id: 'moon-kingdom',
    name: 'Moon Kingdom',
    description: 'Where dreams and magic intertwine under the eternal moonlight',
    gradient: 'from-blue-900 via-purple-900 to-pink-900',
    icon: '🌙',
    color: '#FFB6E1',
    boards: []
  },
  {
    id: 'star-palace',
    name: 'Star Palace',
    description: 'A celestial realm where wishes come true among the constellations',
    gradient: 'from-purple-900 via-pink-900 to-yellow-900',
    icon: '⭐',
    color: '#DDA0DD',
    boards: []
  },
  {
    id: 'crystal-tower',
    name: 'Crystal Tower',
    description: 'Ancient wisdom crystallized in towers of pure magical energy',
    gradient: 'from-cyan-900 via-blue-900 to-purple-900',
    icon: '💎',
    color: '#B0E0E6',
    boards: []
  },
  {
    id: 'flower-garden',
    name: 'Flower Garden',
    description: 'Where nature\'s beauty blooms with magical essence',
    gradient: 'from-pink-900 via-green-900 to-yellow-900',
    icon: '🌸',
    color: '#FFB6C1',
    boards: []
  },
  {
    id: 'rainbow-bridge',
    name: 'Rainbow Bridge',
    description: 'Connecting all realms with bridges of pure light and color',
    gradient: 'from-red-900 via-yellow-900 to-blue-900',
    icon: '🌈',
    color: '#FF6347',
    boards: []
  },
  {
    id: 'heart-sanctuary',
    name: 'Heart Sanctuary',
    description: 'The sacred space where love and friendship forge eternal bonds',
    gradient: 'from-pink-900 via-red-900 to-purple-900',
    icon: '💖',
    color: '#FF69B4',
    boards: []
  }
]