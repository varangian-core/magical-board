import { nanoid } from 'nanoid'

export interface StoredBoard {
  id: string
  name: string
  description?: string
  kingdomId: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  elements: any[]
}

class BoardStorage {
  private boards: Map<string, StoredBoard> = new Map()

  createBoard(name: string, kingdomId: string, userId: string, description?: string): StoredBoard {
    const board: StoredBoard = {
      id: nanoid(),
      name,
      description,
      kingdomId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      elements: []
    }
    
    this.boards.set(board.id, board)
    this.saveToLocalStorage()
    return board
  }

  getBoard(id: string): StoredBoard | undefined {
    return this.boards.get(id)
  }

  getBoardsByKingdom(kingdomId: string): StoredBoard[] {
    return Array.from(this.boards.values())
      .filter(board => board.kingdomId === kingdomId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  updateBoard(id: string, updates: Partial<StoredBoard>): StoredBoard | null {
    const board = this.boards.get(id)
    if (!board) return null
    
    const updatedBoard = {
      ...board,
      ...updates,
      id: board.id, // Ensure ID doesn't change
      createdAt: board.createdAt, // Ensure creation date doesn't change
      updatedAt: new Date()
    }
    
    this.boards.set(id, updatedBoard)
    this.saveToLocalStorage()
    return updatedBoard
  }

  deleteBoard(id: string): boolean {
    const result = this.boards.delete(id)
    if (result) {
      this.saveToLocalStorage()
    }
    return result
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        boards: Array.from(this.boards.entries())
      }
      localStorage.setItem('magical-board-boards', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save boards to localStorage:', e)
    }
  }

  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('magical-board-boards')
      if (stored) {
        const data = JSON.parse(stored)
        this.boards = new Map(data.boards.map(([id, board]: [string, any]) => [
          id,
          {
            ...board,
            createdAt: new Date(board.createdAt),
            updatedAt: new Date(board.updatedAt)
          }
        ]))
      }
    } catch (e) {
      console.error('Failed to load boards from localStorage:', e)
    }
  }
}

const boardStorage = new BoardStorage()

if (typeof window !== 'undefined') {
  boardStorage.loadFromLocalStorage()
}

export default boardStorage