'use client'

import { Blog, blogService } from '@/services/blogService'
import { useEffect, useState } from 'react'
import FeaturedBlog from '../components/blog/FeaturedBlog'
import SubBlogs from '../components/blog/SubBlogs'
import BlogGrid from '../components/blog/BlogGrid'

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState('All')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const allBlogs = await blogService.getBlogs()
        setBlogs(allBlogs)
        console.log(allBlogs)
      } catch (err: any) {
        setError(err?.message || 'Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        Loading blogs...
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-96 text-red-500">
        {error}
      </div>
    )

  if (blogs.length === 0)
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        No blogs available.
      </div>
    )

  const featuredBlog = blogs[0]
  const subBlogs = blogs.slice(1, 3)
  const remainingBlogs = blogs.slice(3)

  // Extract unique tags across all blogs
  const tags = [
    'All',
    'TECHNOLOGY'.toLowerCase(),
    'PROGRAMMING'.toLowerCase(),
    'BUSINESS'.toLowerCase(),
    'DESIGN'.toLowerCase(),
    'LIFESTYLE'.toLowerCase(),
  ]

  // Filter blogs by selected tag
  const filteredBlogs =
    selectedTag === 'All'
      ? remainingBlogs
      : remainingBlogs.filter((b) => b.tags?.includes(selectedTag))

  return (
    <div className="bg-white text-gray-900">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">Latest News</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Featured Blog */}
          <div className="md:col-span-2">
            <FeaturedBlog blog={featuredBlog} />
          </div>

          {/* Sub Blogs */}
          <SubBlogs blogs={subBlogs} />
        </div>
      </section>

      {/* All Blogs Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">All Articles</h2>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <BlogGrid blogs={filteredBlogs} />
      </section>
    </div>
  )
}
