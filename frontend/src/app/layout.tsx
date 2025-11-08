'use client'
import './globals.css'
import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast';
import { GlobalLoginProvider } from '@/context/GlobalLoginProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const NAVBAR_HEIGHT = 64 

  return (
    <html lang="en">
      <body className="relative w-full h-full overflow-hidden bg-gray-50 font-inter">
        <Toaster position="top-right" />
        <AuthProvider>
          <GlobalLoginProvider>
          {/* Navbar (fixed height) */}
          <div
            className="fixed top-0 left-0 right-0 z-30"
            style={{ height: `${NAVBAR_HEIGHT}px` }}
          >
            <Navbar toggleSidebar={toggleSidebar} />
          </div>

          {/* Main Layout Below Navbar */}
          <div
            className="flex pt-0"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, marginTop: `${NAVBAR_HEIGHT}px` }}
          >
            <Sidebar sidebarOpen={sidebarOpen} />
            <main className="flex-1 overflow-y-auto p-4 bg-white">
              {children}
            </main>
          </div>
          </GlobalLoginProvider>
        </AuthProvider>
      </body>
    </html>
  )
}