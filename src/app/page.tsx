
'use client'
// Add at the top
const [editingNote, setEditingNote] = useState<Note | null>(null)
import { useEffect, useState } from 'react'
import NoteForm from './components/NoteForm'


type Note = {
  id: number
  title: string
  content: string
  createdAt: string
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchNotes = async (pageNumber: number) => {
    const res = await fetch(`/api/notes?page=${pageNumber}`)
    const data = await res.json()
    setNotes(data.notes)
    setPage(data.currentPage)
    setTotalPages(data.totalPages)
  }

  useEffect(() => {
    fetchNotes(page)
  }, [page])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNotes(newPage)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📝 My Notes</h1>
      <NoteForm onCreated={() => fetchNotes(page)} />

      {notes.map(note => (
        <div key={note.id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="text-sm mt-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  )
}



const handleDelete = async (id: number) => {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
  if (res.ok) {
    fetchNotes(page)
    if (editingNote?.id === id) setEditingNote(null)
  }
}

<NoteForm
  onCreated={() => fetchNotes(page)}
  editingNote={editingNote || undefined}
  clearEdit={() => setEditingNote(null)}
/>

{notes.map(note => (
  <div key={note.id} className="border p-4 mb-3 rounded">
    <h2 className="font-semibold">{note.title}</h2>
    <p>{note.content}</p>
    <div className="flex gap-4 mt-2 text-sm">
      <button
        onClick={() => setEditingNote(note)}
        className="text-blue-600 underline"
      >
        ✏️ Edit
      </button>
      <button
        onClick={() => handleDelete(note.id)}
        className="text-red-600 underline"
      >
        🗑 Delete
      </button>
    </div>
  </div>
))}
