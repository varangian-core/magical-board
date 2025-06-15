'use client'

import { motion } from 'framer-motion'
import { Kingdom } from '@/lib/kingdoms'
import Link from 'next/link'

interface KingdomCardProps {
  kingdom: Kingdom
  boards: any[]
  index: number
  onCreateBoard: () => void
}

export default function KingdomCard({ kingdom, boards, index, onCreateBoard }: KingdomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${kingdom.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{kingdom.icon}</span>
            <h3 className="text-xl font-bold text-white">{kingdom.name}</h3>
          </div>
          <span className="text-sm text-white/60">{boards.length} boards</span>
        </div>

        <p className="text-white/80 text-sm mb-6">{kingdom.description}</p>

        {boards.length > 0 ? (
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {boards.slice(0, 3).map(board => (
              <Link key={board.id} href={`/board/${board.id}`}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-white">{board.name}</span>
                  <span className="text-xs text-white/40">
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </span>
                </motion.div>
              </Link>
            ))}
            {boards.length > 3 && (
              <p className="text-xs text-white/60 text-center">
                +{boards.length - 3} more boards
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-3xl mb-2 opacity-50">🌟</div>
            <p className="text-sm text-white/60">No boards yet</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateBoard}
          className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors"
        >
          Create New Board ✨
        </motion.button>
      </div>
    </motion.div>
  )
}