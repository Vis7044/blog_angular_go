'use client'
import Link from 'next/link'
import { House, BookOpenText, Phone, Bookmark } from 'lucide-react';

export const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  return (
    <div
      className={`bg-gray-50 transition-all duration-300 h-screen flex flex-col ${
        sidebarOpen ? 'w-64 border-r-1 border-gray-200' : 'w-16'
      }`}
    >
      <div className="flex flex-col mt-6 space-y-2 text-lg">
        <Link href="/" className="px-4 py-2 text-black hover:text-orange-900">
          {sidebarOpen && 
          <span className='flex flex-row gap-1'>
            <House />Home
            </span>}
        </Link>
        <Link href="/blogs" className="px-4 py-2 text-black hover:text-orange-900">
          {sidebarOpen &&
            <span className='flex flex-row gap-1'>
                <BookOpenText />Blogs
            </span>}
        </Link>
        <Link href="/contact" className="px-4 py-2 text-black hover:text-orange-900">
          {sidebarOpen && 
          <span className='flex flex-row gap-1'>
            <Phone />
            Contact
            </span>}
        </Link>
        <Link href="/bookmarks" className="px-4 py-2 text-black hover:text-orange-900">
          {sidebarOpen && 
          <span className='flex flex-row gap-1'>
            <Bookmark />Bookmarks
            </span>}
        </Link>

      </div>
    </div>
  )
}
