'use client'

import Link from 'next/link'
import { Blog } from '@/services/blogService'

export default function SubBlogs({ blogs }: { blogs: Blog[] }) {
  const getPreview = (content?: string) => {
    if (!content) return 'Read this exciting article...'
    const plainText = content.replace(/<[^>]+>/g, '')
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText
  }

  return (
    <div className="flex flex-col gap-6">
      {blogs.map((b) => (
        <div
          key={b._id}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {b.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {getPreview(b.content)}
          </p>
          <Link
            href={`/blogs/${b._id}`}
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            Read more →
          </Link>
        </div>
      ))}
    </div>
  )
}
