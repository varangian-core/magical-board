import { create } from 'zustand'
import { nanoid } from 'nanoid'

export interface BoardElement {
  id: string
  type: 'card' | 'image' | 'timeline'
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zIndex: number
  content: any
  createdBy: string
  lockedBy?: string
}

interface BoardStore {
  elements: BoardElement[]
  selectedElement: string | null
  currentUser: any
  addElement: (element: Partial<BoardElement>) => void
  updateElement: (id: string, updates: Partial<BoardElement>) => void
  deleteElement: (id: string) => void
  setSelectedElement: (id: string | null) => void
  setCurrentUser: (user: any) => void
}

const useBoardStore = create<BoardStore>((set) => ({
  elements: [],
  selectedElement: null,
  currentUser: null,

  addElement: (element) =>
    set((state) => ({
      elements: [
        ...state.elements,
        {
          id: nanoid(),
          type: 'card',
          position: { x: 100, y: 100 },
          size: { width: 300, height: 200 },
          rotation: 0,
          zIndex: state.elements.length,
          content: { text: 'New Card', color: '#FFB6E1' },
          createdBy: state.currentUser?.id || 'anonymous',
          ...element,
        } as BoardElement,
      ],
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElement: state.selectedElement === id ? null : state.selectedElement,
    })),

  setSelectedElement: (id) => set({ selectedElement: id }),
  setCurrentUser: (user) => set({ currentUser: user }),
}))

export default useBoardStore