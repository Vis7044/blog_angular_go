'use client'
import './globals.css'
import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <html lang="en">
      <body>
      <AuthProvider>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex h-screen">
          <Sidebar sidebarOpen={sidebarOpen} />
          <main className="flex-1 p-4">
            {children}
            </main>
        </div>
        </AuthProvider>
      </body>
    </html>
  )
}
