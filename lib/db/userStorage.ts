import { prisma } from './prisma'
import { User } from '@prisma/client'

export interface UserWithAvatar extends User {
  avatar: {
    id: string
    name: string
    emoji: string
    color: string
  }
}

class DatabaseUserStorage {
  async createUser(name: string, avatar: any): Promise<UserWithAvatar> {
    const user = await prisma.user.create({
      data: {
        name,
        avatarId: avatar.id,
        avatarName: avatar.name,
        avatarEmoji: avatar.emoji,
        avatarColor: avatar.color,
      }
    })
    
    return this.formatUser(user)
  }

  async getAllUsers(): Promise<UserWithAvatar[]> {
    const users = await prisma.user.findMany({
      orderBy: { lastActive: 'desc' }
    })
    
    return users.map(this.formatUser)
  }

  async getUser(id: string): Promise<UserWithAvatar | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    return user ? this.formatUser(user) : null
  }

  async updateLastActive(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() }
    })
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  private formatUser(user: User): UserWithAvatar {
    return {
      ...user,
      avatar: {
        id: user.avatarId || '',
        name: user.avatarName || '',
        emoji: user.avatarEmoji || '',
        color: user.avatarColor || ''
      }
    }
  }
}

export const dbUserStorage = new DatabaseUserStorage()