import { prisma } from './prisma'
import { Board, BoardElement, Prisma } from '@prisma/client'

export interface BoardWithElements extends Board {
  boardElements: BoardElement[]
}

class DatabaseBoardStorage {
  async createBoard(
    name: string, 
    kingdomId: string, 
    userId: string, 
    description?: string
  ): Promise<Board> {
    const board = await prisma.board.create({
      data: {
        name,
        description,
        kingdomId,
        createdBy: userId,
      },
      include: {
        creator: true
      }
    })
    
    // Add user to board
    await prisma.boardUser.create({
      data: {
        boardId: board.id,
        userId: userId
      }
    })
    
    return board
  }

  async getBoard(id: string): Promise<BoardWithElements | null> {
    return await prisma.board.findUnique({
      where: { id },
      include: {
        boardElements: {
          orderBy: { zIndex: 'asc' }
        }
      }
    })
  }

  async getBoardsByKingdom(kingdomId: string): Promise<Board[]> {
    return await prisma.board.findMany({
      where: { kingdomId },
      orderBy: { updatedAt: 'desc' },
      include: {
        creator: true
      }
    })
  }

  async updateBoard(id: string, updates: Partial<Board>): Promise<Board | null> {
    try {
      return await prisma.board.update({
        where: { id },
        data: updates
      })
    } catch {
      return null
    }
  }

  async deleteBoard(id: string): Promise<boolean> {
    try {
      await prisma.board.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  // Board Elements
  async addElement(boardId: string, element: any): Promise<BoardElement> {
    return await prisma.boardElement.create({
      data: {
        boardId,
        type: element.type,
        positionX: element.position.x,
        positionY: element.position.y,
        width: element.size.width,
        height: element.size.height,
        rotation: element.rotation || 0,
        zIndex: element.zIndex || 0,
        content: element.content,
        createdBy: element.createdBy
      }
    })
  }

  async updateElement(
    id: string, 
    updates: Partial<BoardElement>
  ): Promise<BoardElement | null> {
    try {
      const updateData: any = {}
      
      if (updates.positionX !== undefined) updateData.positionX = updates.positionX
      if (updates.positionY !== undefined) updateData.positionY = updates.positionY
      if (updates.width !== undefined) updateData.width = updates.width
      if (updates.height !== undefined) updateData.height = updates.height
      if (updates.rotation !== undefined) updateData.rotation = updates.rotation
      if (updates.zIndex !== undefined) updateData.zIndex = updates.zIndex
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.lockedBy !== undefined) updateData.lockedBy = updates.lockedBy
      
      return await prisma.boardElement.update({
        where: { id },
        data: updateData
      })
    } catch {
      return null
    }
  }

  async deleteElement(id: string): Promise<boolean> {
    try {
      await prisma.boardElement.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  async getBoardElements(boardId: string): Promise<BoardElement[]> {
    return await prisma.boardElement.findMany({
      where: { boardId },
      orderBy: { zIndex: 'asc' }
    })
  }

  // Track board users
  async addUserToBoard(boardId: string, userId: string): Promise<void> {
    await prisma.boardUser.upsert({
      where: {
        boardId_userId: {
          boardId,
          userId
        }
      },
      update: {
        lastSeen: new Date()
      },
      create: {
        boardId,
        userId
      }
    })
  }

  async getBoardUsers(boardId: string): Promise<any[]> {
    return await prisma.boardUser.findMany({
      where: { boardId },
      include: {
        user: true
      }
    })
  }
}

export const dbBoardStorage = new DatabaseBoardStorage()