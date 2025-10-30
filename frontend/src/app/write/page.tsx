'use client'

import { useState } from 'react'
import { RichTextEditor } from '../components/RichTextEditor'

export default function Write() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    console.log('Title:', title)
    console.log('Content:', content)
    // send to API: await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ title, content }) })
  }

  return (
    <div className="max-w-3xl p-6 mx-10 w-full">
      <h1 className="text-3xl font-semibold mb-2">What's in your mind today!</h1>

      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-lg focus:outline-none"
      />

      <RichTextEditor />

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
      >
        Publish Post
      </button>
    </div>
  )
}
