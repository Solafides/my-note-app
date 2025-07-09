import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 5
    const skip = (page - 1) * pageSize

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.note.count(),
    ])

    return NextResponse.json({
      notes,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    })
  } catch (error) {
    console.error('GET /api/notes error:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: { title, content },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('POST /api/notes error:', error)
    return NextResponse.json(
      { error: 'Something went wrong while creating the note.' },
      { status: 500 }
    )
  }
}
