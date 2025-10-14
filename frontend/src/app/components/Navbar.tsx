'use client'
import { useState } from 'react'

import { Menu, X, PenSquare } from 'lucide-react'
import Link from 'next/link'
import { LoginDialog } from './LoginDialog'
import { SquarePen } from 'lucide-react';

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [visible, setVisible] = useState(false)
  const [burgerVis, setBurgerVis] = useState(false);
  

  return (
    <>
      <nav className="bg-gray-50 border-b-1 border-gray-200 text-black p-4 flex justify-between items-center">
        {/* Left: Toggle + Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md transition-colors"
          >
            <div
                className={`transition-transform duration-300 cursor-pointer ${
                burgerVis ? "rotate-0" : "rotate-180"
                }`}
                onClick={() => setBurgerVis(!burgerVis)}
            >
                {burgerVis ? (
                <Menu className="w-6 h-6 transition-transform duration-300" />
                ) : (
                <X className="w-6 h-6 transition-transform duration-300" />
                )}
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <PenSquare className="w-6 h-6" />
            <span className="font-bold text-xl">My Blog</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/write"
            className="flex flex-row gap-2 text-black px-4 py-2 rounded-lg transition-colors"
          >

            <SquarePen />Write
          </Link>
          <button
            onClick={() => setVisible(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign In / Up
          </button>
        </div>
      </nav>
      <LoginDialog visible={visible} setVisible={setVisible} />
    </>
  )
}
