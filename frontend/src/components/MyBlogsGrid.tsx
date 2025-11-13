'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Blog } from '@/services/blogService'
import { Heart, MessageSquare, Edit } from 'lucide-react'
import { useAuth } from '@/context/AuthContext' // assuming you have AuthContext

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
  const { user } = useAuth() // logged-in user

  const getPreview = (content?: string) => {
    if (!content) return 'Read this exciting article...'
    const plainText = content.replace(/<[^>]+>/g, '')
    return plainText.length > 400 ? plainText.slice(0, 400) + '...' : plainText
  }
  

  return (
    <div className="flex flex-col gap-6">
      {blogs.map((b) => (
        <div
          key={b._id}
          className="flex flex-col sm:flex-row border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300"
        >
          {/* Image Section */}
          <div className="relative sm:w-2/5 w-full h-52 sm:h-auto">
            <Image
              src={b.coverPhoto || '/default-blog.jpg'}
              alt={b.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between p-5 sm:w-3/5">
            <div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{b.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {getPreview(b.content)}
              </p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Heart size={14} className="text-pink-500 fill-pink-500" />
                  <span>{b.likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{b.comments.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit option visible only if blog belongs to logged-in user */}
                
                  <Link
                    href={`/editblog/${b._id}`}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>
                
                <Link
                  href={`/blogs/${b._id}`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
