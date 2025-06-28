'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import userStorage from '@/lib/userStorage'
import boardStorage from '@/lib/boardStorage'
import { kingdoms } from '@/lib/kingdoms'
import CreateBoardModal from '@/components/CreateBoardModal'
import EditBoardModal from '@/components/EditBoardModal'

interface BoardWithKingdom {
  id: string
  name: string
  description?: string
  kingdomId: string
  kingdom: any
  createdAt: Date
  updatedAt: Date
  createdBy: string
  elements: any[]
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardWithKingdom[]>([])
  const [filteredBoards, setFilteredBoards] = useState<BoardWithKingdom[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKingdom, setSelectedKingdom] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'kingdom'>('date')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedKingdomForCreate, setSelectedKingdomForCreate] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingBoard, setEditingBoard] = useState<BoardWithKingdom | null>(null)

  useEffect(() => {
    loadBoards()
    const user = userStorage.getCurrentUser()
    setCurrentUser(user)
  }, [])

  const loadBoards = () => {
    setIsLoading(true)
    const allBoards: BoardWithKingdom[] = []
    
    kingdoms.forEach(kingdom => {
      const kingdomBoards = boardStorage.getBoardsByKingdom(kingdom.id)
      const boardsWithKingdom = kingdomBoards.map(board => ({
        ...board,
        kingdom
      }))
      allBoards.push(...boardsWithKingdom)
    })
    
    setBoards(allBoards)
    setFilteredBoards(allBoards)
    setIsLoading(false)
  }

  useEffect(() => {
    let filtered = [...boards]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(board => 
        board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by kingdom
    if (selectedKingdom) {
      filtered = filtered.filter(board => board.kingdomId === selectedKingdom)
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'date':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'kingdom':
        filtered.sort((a, b) => a.kingdom.name.localeCompare(b.kingdom.name))
        break
    }

    setFilteredBoards(filtered)
  }, [boards, searchQuery, selectedKingdom, sortBy])

  const handleDeleteBoard = (boardId: string) => {
    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      boardStorage.deleteBoard(boardId)
      loadBoards()
    }
  }

  const handleDuplicateBoard = (board: BoardWithKingdom) => {
    if (!currentUser) {
      alert('Please create a guardian first')
      return
    }
    
    const newBoard = boardStorage.createBoard(
      `${board.name} (Copy)`,
      board.kingdomId,
      currentUser.id,
      board.description
    )
    
    // TODO: Copy board elements when backend is ready
    
    loadBoards()
  }

  const handleCreateBoard = (name: string, description?: string) => {
    if (selectedKingdomForCreate && currentUser) {
      const board = boardStorage.createBoard(name, selectedKingdomForCreate, currentUser.id, description)
      setShowCreateModal(false)
      window.location.href = `/board/${board.id}`
    }
  }

  const handleEditBoard = (boardId: string, name: string, description?: string) => {
    boardStorage.updateBoard(boardId, { name, description })
    loadBoards()
    setEditingBoard(null)
  }

  return (
    <div className="min-h-screen">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: Math.random() * 0.8 + 0.2
            }}
            animate={{
              y: [null, -100],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatDelay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">My Magical Boards</h1>
            <p className="text-white/70">Manage and organize your collaborative workspaces</p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Kingdom Filter */}
              <select
                value={selectedKingdom || ''}
                onChange={(e) => setSelectedKingdom(e.target.value || null)}
                className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="">All Kingdoms</option>
                {kingdoms.map(kingdom => (
                  <option key={kingdom.id} value={kingdom.id}>
                    {kingdom.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="kingdom">Sort by Kingdom</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-white/70">
                {filteredBoards.length} board{filteredBoards.length !== 1 ? 's' : ''} found
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentUser) {
                    setSelectedKingdomForCreate(kingdoms[0].id)
                    setShowCreateModal(true)
                  } else {
                    alert('Please create a guardian first')
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg"
              >
                Create New Board
              </motion.button>
            </div>
          </motion.div>

          {/* Board Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
              >
                ⭐
              </motion.div>
            </div>
          ) : filteredBoards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/70 text-lg mb-4">
                {searchQuery || selectedKingdom ? 'No boards found matching your criteria' : 'No boards yet'}
              </p>
              {!searchQuery && !selectedKingdom && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg"
                >
                  Go to Dashboard
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBoards.map((board, index) => (
                  <motion.div
                    key={board.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                      {/* Kingdom Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm text-white/80">
                          {board.kingdom.name}
                        </span>
                        <span className="text-2xl">{board.kingdom.emoji}</span>
                      </div>

                      {/* Board Info */}
                      <h3 className="text-xl font-semibold text-white mb-2">{board.name}</h3>
                      {board.description && (
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">{board.description}</p>
                      )}

                      {/* Metadata */}
                      <div className="text-white/50 text-xs mb-4 space-y-1">
                        <p>Updated: {new Date(board.updatedAt).toLocaleDateString()}</p>
                        <p>Elements: {board.elements.length}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/board/${board.id}`} className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
                          >
                            Open
                          </motion.button>
                        </Link>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingBoard(board)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDuplicateBoard(board)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          title="Duplicate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteBoard(board.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && selectedKingdomForCreate && (
        <CreateBoardModal
          kingdom={kingdoms.find(k => k.id === selectedKingdomForCreate)!}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBoard}
        />
      )}

      {/* Edit Board Modal */}
      {editingBoard && (
        <EditBoardModal
          board={editingBoard}
          onClose={() => setEditingBoard(null)}
          onSave={handleEditBoard}
        />
      )}
    </div>
  )
}