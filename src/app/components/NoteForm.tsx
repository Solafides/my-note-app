'use client'

import { useEffect, useState } from 'react'

type Props = {
  onCreated: () => void
  editingNote?: { id: number; title: string; content: string }
  clearEdit?: () => void
}

export default function NoteForm({ onCreated, editingNote, clearEdit }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [editingNote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const method = editingNote ? 'PUT' : 'POST'
      const url = editingNote
        ? `/api/notes/${editingNote.id}`
        : '/api/notes'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setTitle('')
      setContent('')
      onCreated()
      clearEdit?.()
    } catch {
      setError('Failed to submit. Try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      {error && <p className="text-red-600">{error}</p>}
      <input
        className="border w-full p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border w-full p-2"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
        {editingNote && (
          <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-4 py-2">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
