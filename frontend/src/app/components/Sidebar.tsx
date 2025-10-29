'use client'

import Link from 'next/link'
import {
  House,
  BookOpenText,
  Phone,
  Bookmark,
  Settings,
  CircleUserRound,
} from 'lucide-react'

export const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  return (
    <div
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 h-screen flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {sidebarOpen ? (
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
        ) : (
          <House className="w-6 h-6 text-gray-700" />
        )}
      </div>

      {/* Menu Links */}
      <div className="flex flex-col mt-6 space-y-1 text-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <House className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Home</span>}
        </Link>

        <Link
          href="/blogs"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <BookOpenText className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Blogs</span>}
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <Phone className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Contact</span>}
        </Link>

        <Link
          href="/bookmarks"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <Bookmark className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Bookmarks</span>}
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <CircleUserRound className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Profile</span>}
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 hover:text-green-700 rounded-md transition"
        >
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Settings</span>}
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto mb-4 text-center">
        {sidebarOpen ? (
          <p className="text-xs text-gray-500">© 2025 Mithalesh Dev</p>
        ) : (
          <Settings className="w-4 h-4 mx-auto text-gray-400" />
        )}
      </div>
    </div>
  )
}
