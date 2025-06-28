'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import userStorage from '@/lib/userStorage'
import boardStorage from '@/lib/boardStorage'

export default function NavigationSidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [recentBoards, setRecentBoards] = useState<any[]>([])
  const pathname = usePathname()

  useEffect(() => {
    // Load current user
    const user = userStorage.getCurrentUser()
    setCurrentUser(user)

    // Load recent boards
    if (user) {
      const allBoards: any[] = []
      const kingdoms = ['moon', 'star', 'crystal'] // Add your kingdom IDs
      kingdoms.forEach(kingdomId => {
        const boards = boardStorage.getBoardsByKingdom(kingdomId)
        allBoards.push(...boards)
      })
      // Sort by updated date and take top 5
      const sorted = allBoards.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ).slice(0, 5)
      setRecentBoards(sorted)
    }
  }, [pathname])

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏰',
      href: '/',
      active: pathname === '/'
    },
    {
      id: 'manage',
      label: 'Manage Boards',
      icon: '📋',
      href: '/boards',
      active: pathname === '/boards'
    },
    {
      id: 'boards',
      label: 'Recent Boards',
      icon: '✨',
      expanded: true,
      children: recentBoards.map(board => ({
        id: board.id,
        label: board.name,
        href: `/board/${board.id}`,
        active: pathname === `/board/${board.id}`,
        kingdom: board.kingdomId
      }))
    }
  ]

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          fixed top-4 z-50 bg-purple-600/90 backdrop-blur-sm text-white p-2 rounded-lg
          transition-all duration-300 hover:bg-purple-700/90
          ${isExpanded ? 'left-[216px]' : 'left-4'}
        `}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isExpanded ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900/95 to-blue-900/95 backdrop-blur-md border-r border-white/10 z-40 overflow-y-auto"
          >
            <div className="p-6">
              {/* Logo/Title */}
              <Link href="/" className="block mb-8">
                <motion.h2 
                  className="text-2xl font-bold text-white flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl">🌟</span>
                  Magical Board
                </motion.h2>
              </Link>

              {/* User Info */}
              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentUser.avatar.emoji}</span>
                    <div>
                      <p className="text-white font-semibold">{currentUser.name}</p>
                      <p className="text-white/70 text-sm">{currentUser.avatar.name}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {item.href ? (
                      <Link href={item.href}>
                        <motion.div
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                            ${item.active 
                              ? 'bg-white/20 text-white' 
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }
                          `}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </motion.div>
                      </Link>
                    ) : (
                      <div className="mb-2">
                        <div className="flex items-center gap-3 px-4 py-2 text-white/60">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                      </div>
                    )}

                    {/* Children (Recent Boards) */}
                    {item.children && item.children.length > 0 && (
                      <div className="ml-8 space-y-1 mt-1">
                        {item.children.map((child) => (
                          <Link key={child.id} href={child.href}>
                            <motion.div
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                px-4 py-2 rounded-lg text-sm transition-colors
                                ${child.active 
                                  ? 'bg-white/15 text-white' 
                                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }
                              `}
                            >
                              {child.label}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {item.children && item.children.length === 0 && (
                      <div className="ml-8 px-4 py-2 text-white/40 text-sm">
                        No recent boards
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg"
                  onClick={() => window.location.href = '/'}
                >
                  New Board
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-3xl" />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  )
}