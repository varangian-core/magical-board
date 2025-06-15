'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const BoardCanvas = dynamic(() => import('@/components/BoardCanvas'), {
  ssr: false,
})

export default function BoardPage() {
  const params = useParams()
  const boardId = params.id as string

  return (
    <div className="h-screen w-screen overflow-hidden">
      <BoardCanvas boardId={boardId} />
    </div>
  )
}