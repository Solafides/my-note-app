import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 })
    }

    const note = await prisma.note.update({
      where: { id: Number(params.id) },
      data: { title, content },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update note.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.note.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete note.' }, { status: 500 })
  }
}
