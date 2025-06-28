import { NextRequest, NextResponse } from 'next/server'
import { dbBoardStorage } from '@/lib/db/boardStorage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kingdomId = searchParams.get('kingdomId')
    
    if (!kingdomId) {
      return NextResponse.json(
        { error: 'Kingdom ID is required' }, 
        { status: 400 }
      )
    }
    
    const boards = await dbBoardStorage.getBoardsByKingdom(kingdomId)
    return NextResponse.json(boards)
  } catch (error) {
    console.error('Failed to fetch boards:', error)
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, kingdomId, userId, description } = await request.json()
    
    if (!name || !kingdomId || !userId) {
      return NextResponse.json(
        { error: 'Name, kingdom ID, and user ID are required' }, 
        { status: 400 }
      )
    }
    
    const board = await dbBoardStorage.createBoard(name, kingdomId, userId, description)
    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Failed to create board:', error)
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 })
  }
}