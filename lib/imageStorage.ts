import { nanoid } from 'nanoid'

interface StoredImage {
  id: string
  url: string
  name: string
  size: number
  createdAt: Date
  boardId: string
}

class ImageStorage {
  private images: Map<string, StoredImage> = new Map()
  private maxStorageSize = 50 * 1024 * 1024 // 50MB limit
  private currentStorageSize = 0

  async storeImage(file: File, boardId: string): Promise<StoredImage> {
    return new Promise((resolve, reject) => {
      // Check storage limit
      if (this.currentStorageSize + file.size > this.maxStorageSize) {
        reject(new Error('Storage limit exceeded. Please remove some images.'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const imageId = nanoid()
        
        const storedImage: StoredImage = {
          id: imageId,
          url: imageUrl,
          name: file.name,
          size: file.size,
          createdAt: new Date(),
          boardId,
        }

        this.images.set(imageId, storedImage)
        this.currentStorageSize += file.size
        
        // Store in localStorage for persistence
        this.saveToLocalStorage()
        
        resolve(storedImage)
      }
      
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })
  }

  getImage(id: string): StoredImage | undefined {
    return this.images.get(id)
  }

  getImagesByBoard(boardId: string): StoredImage[] {
    return Array.from(this.images.values()).filter(img => img.boardId === boardId)
  }

  deleteImage(id: string): boolean {
    const image = this.images.get(id)
    if (image) {
      this.currentStorageSize -= image.size
      this.images.delete(id)
      this.saveToLocalStorage()
      return true
    }
    return false
  }

  clearBoardImages(boardId: string): void {
    const boardImages = this.getImagesByBoard(boardId)
    boardImages.forEach(img => this.deleteImage(img.id))
  }

  getStorageInfo() {
    return {
      used: this.currentStorageSize,
      limit: this.maxStorageSize,
      percentage: (this.currentStorageSize / this.maxStorageSize) * 100,
      imageCount: this.images.size,
    }
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        images: Array.from(this.images.entries()),
        currentStorageSize: this.currentStorageSize,
      }
      localStorage.setItem('magical-board-images', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save images to localStorage:', e)
    }
  }

  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('magical-board-images')
      if (stored) {
        const data = JSON.parse(stored)
        this.images = new Map(data.images)
        this.currentStorageSize = data.currentStorageSize || 0
      }
    } catch (e) {
      console.error('Failed to load images from localStorage:', e)
    }
  }
}

// Singleton instance
const imageStorage = new ImageStorage()

// Load stored images on initialization
if (typeof window !== 'undefined') {
  imageStorage.loadFromLocalStorage()
}

export default imageStorage