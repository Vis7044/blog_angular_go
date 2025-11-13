'use client';
import { useState } from 'react'
import { Menu, X, SquarePen, CircleUserRound, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { LoginDialog } from './LoginDialog'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { eventEmitter } from '@/utils/eventEmittor'

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [visible, setVisible] = useState(false)
  const [burgerVis, setBurgerVis] = useState(true)
  const { user } = useAuth()

  const handleToggle = () => {
    setBurgerVis(!burgerVis)
    toggleSidebar()
  }
  const router = useRouter()
  const handleWriteClick = () => {
    if (!user) {
      eventEmitter.emit('showLoginModal')
    }
    else {
      router.push('/write')
    }
  } 

  return (
    <>
      <nav className="bg-white border-b border-gray-200 text-gray-800 px-6 py-3 flex justify-between items-center">
        {/* Left: Toggle + Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div
              className={`transition-transform duration-300 cursor-pointer ${
                burgerVis ? 'rotate-0' : 'rotate-180'
              }`}
            >
              {burgerVis ? (
                <Menu className="w-6 h-6 transition-transform duration-300 text-gray-700" />
              ) : (
                <X className="w-6 h-6 transition-transform duration-300 text-gray-700" />
              )}
            </div>
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={140}
              height={60}
              className="rounded-lg"
            />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <Search className="absolute left-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs, topics or authors..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <div
            onClick={handleWriteClick}
            className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all font-medium"
          >
            <SquarePen className="w-5 h-5" />
            <span className="hidden sm:inline">Write</span>
          </div>

          {!user ? (
            <button
              onClick={() => setVisible(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Sign In / Up
            </button>
          ) : (
            <Link
              href="/profile"
              className="flex items-center gap-1 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              {!user.profilePic ?(
              <CircleUserRound className="w-5 h-5" />
              ) : (
              <img src={user.profilePic} className='w-6 rounded-full'/>
              )}
              <span className="hidden sm:inline font-medium">{user.name}</span>
            </Link>
          )}
        </div>
      </nav>

      <LoginDialog visible={visible} setVisible={setVisible} />
    </>
  )
}
