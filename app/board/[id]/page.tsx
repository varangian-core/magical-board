'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ErrorBoundary from '@/components/ErrorBoundary'

const BoardCanvas = dynamic(() => import('@/components/BoardCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-starry">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl"
      >
        ⭐
      </motion.div>
    </div>
  )
})

export default function BoardPage() {
  const params = useParams()
  const boardId = params.id as string
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-starry">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <BoardCanvas boardId={boardId} />
      </div>
    </ErrorBoundary>
  )
}