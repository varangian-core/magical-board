import { NextRequest, NextResponse } from 'next/server'
import { dbUserStorage } from '@/lib/db/userStorage'

export async function GET() {
  try {
    const users = await dbUserStorage.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, avatar } = await request.json()
    
    if (!name || !avatar) {
      return NextResponse.json(
        { error: 'Name and avatar are required' }, 
        { status: 400 }
      )
    }
    
    const user = await dbUserStorage.createUser(name, avatar)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}