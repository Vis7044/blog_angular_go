'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House,
  BookOpenText,
  Phone,
  Bookmark,
  Settings,
  CircleUserRound,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const Sidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const pathname = usePathname()
  const { token, logout } = useAuth()

  const navItems = [
    { href: '/', label: 'Home', icon: House },
    { href: '/blogs', label: 'Blogs', icon: BookOpenText },
    { href: '/contact', label: 'Contact', icon: Phone },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { href: '/profile', label: 'Profile', icon: CircleUserRound },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div
      className={`bg-gray-50 border-r border-gray-200 transition-[width] duration-300 h-screen flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Menu Links */}
      <div className="flex flex-col mt-6 space-y-1 text-gray-700">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 px-4 py-2 rounded-md overflow-hidden
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
            >
              {/* Smooth left border indicator */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-green-500 transition-all duration-300 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`}
              />
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              {sidebarOpen && (
                <span className="font-medium transition-opacity duration-300">
                  {label}
                </span>
              )}
            </Link>
          )
        })}

        {/* Logout button (only if user is logged in) */}
        {token && (
          <button
            onClick={logout}
            className="group relative flex items-center gap-3 px-4 py-2 rounded-md overflow-hidden
              transition-all duration-300 ease-in-out text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <span
              className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-red-500 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-50"
            />
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            {sidebarOpen && (
              <span className="font-medium transition-opacity duration-300">
                Logout
              </span>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto mb-4 text-center">
        {sidebarOpen ? (
          <p className="text-xs text-gray-500">© 2025 Mithalesh Dev</p>
        ) : (
          <Settings className="w-4 h-4 mx-auto text-gray-400 transition-all duration-300" />
        )}
      </div>
    </div>
  )
}
