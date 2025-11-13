'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Blog } from '@/services/blogService'

export default function FeaturedBlog({ blog }: { blog: Blog }) {
  const getPreview = (content?: string) => {
    if (!content) return 'Read this exciting article...'
    const plainText = content.replace(/<[^>]+>/g, '')
    return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText
  }

  return (
    <div className="relative h-[420px] rounded-2xl overflow-hidden group shadow-lg">
      <Image
        src={blog.coverPhoto || '/default-blog.jpg'}
        alt={blog.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 p-6 text-white max-w-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-sm opacity-90 mb-4 line-clamp-3">
          {getPreview(blog.content)}
        </p>
        <Link
          href={`/blogs/${blog._id}`}
          className="bg-white text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Read more
        </Link>
      </div>
    </div>
  )
}
