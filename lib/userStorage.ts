import { nanoid } from 'nanoid'

export interface User {
  id: string
  name: string
  avatar: {
    id: string
    name: string
    emoji: string
    color: string
  }
  createdAt: Date
  lastActive: Date
}

class UserStorage {
  private users: Map<string, User> = new Map()
  private currentUserId: string | null = null

  createUser(name: string, avatar: any): User {
    const user: User = {
      id: nanoid(),
      name,
      avatar,
      createdAt: new Date(),
      lastActive: new Date()
    }
    
    this.users.set(user.id, user)
    this.saveToLocalStorage()
    return user
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).sort((a, b) => 
      b.lastActive.getTime() - a.lastActive.getTime()
    )
  }

  getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId
    const user = this.users.get(userId)
    if (user) {
      user.lastActive = new Date()
      this.saveToLocalStorage()
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUserId) return null
    return this.users.get(this.currentUserId) || null
  }

  deleteUser(id: string): boolean {
    const result = this.users.delete(id)
    if (result && this.currentUserId === id) {
      this.currentUserId = null
    }
    this.saveToLocalStorage()
    return result
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        users: Array.from(this.users.entries()),
        currentUserId: this.currentUserId
      }
      localStorage.setItem('magical-board-users', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save users to localStorage:', e)
    }
  }

  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('magical-board-users')
      if (stored) {
        const data = JSON.parse(stored)
        this.users = new Map(data.users.map(([id, user]: [string, any]) => [
          id,
          {
            ...user,
            createdAt: new Date(user.createdAt),
            lastActive: new Date(user.lastActive)
          }
        ]))
        this.currentUserId = data.currentUserId
      }
    } catch (e) {
      console.error('Failed to load users from localStorage:', e)
    }
  }
}

const userStorage = new UserStorage()

if (typeof window !== 'undefined') {
  userStorage.loadFromLocalStorage()
}

export default userStorage