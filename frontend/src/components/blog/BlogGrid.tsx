'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Blog } from '@/services/blogService'
import { Heart, MessageSquare } from 'lucide-react'

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
  const getPreview = (content?: string) => {
    if (!content) return 'Read this exciting article...'
    const plainText = content.replace(/<[^>]+>/g, '')
    return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((b) => (
        <div
          key={b._id}
          className="flex flex-col border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Blog Image Section */}
          <div className="relative h-56 md:h-60 rounded-t-2xl overflow-hidden group">
            <Image
              src={b.coverPhoto || '/default-blog.jpg'}
              alt={b.title}
              fill
              className="object-cover"
            />

            {/* User Overlay (shows on hover) */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start p-4">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow">
                <Image
                  src={
                    (b as any).userProfile ||
                    'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/b5ncqfgyzqj99sojluem.png'
                  }
                  alt="User profile"
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-gray-300"
                />
                <span className="text-sm font-medium text-gray-800">
                  {(b as any).userName || 'Gr00t'}
                </span>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="flex flex-col justify-between p-5 flex-grow">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {b.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {getPreview(b.content)}
              </p>
            </div>

            {/* Blog Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Heart size={15} className="text-pink-500" />
                  <span>{b.likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={15} className="text-gray-500" />
                  <span>{b.comments.length}</span>
                </div>
              </div>

              <Link
                href={`/blogs/${b._id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Read more →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
