'use client'
import React, { useState } from 'react'
import { UserCircle, Users, FolderOpen, Trash2, User } from 'lucide-react'

import MyProfile from '../components/MyProfile'
import Teams from '../components/Teams'
import TeamMembers from '../components/TeamMembers'
import YourWork from '../components/YourWork'
import DeleteAccount from '../components/DeleteAccount'

const Profile = () => {
  const [activeSection, setActiveSection] = useState('myprofile')

  const renderSection = () => {
    switch (activeSection) {
      case 'myprofile':
        return <MyProfile />
      case 'teams':
        return <Teams />
      case 'teammembers':
        return <TeamMembers />
      case 'yourwork':
        return <YourWork />
      case 'delete':
        return <DeleteAccount />
      default:
        return <MyProfile />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md border-r border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center md:text-left">
          Settings
        </h2>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveSection('myprofile')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeSection === 'myprofile'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <UserCircle size={20} /> My Profile
          </button>

          <button
            onClick={() => setActiveSection('teams')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeSection === 'teams'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <Users size={20} /> Teams
          </button>

          <button
            onClick={() => setActiveSection('teammembers')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeSection === 'teammembers'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <User size={20} /> Team Members
          </button>

          <button
            onClick={() => setActiveSection('yourwork')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeSection === 'yourwork'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <FolderOpen size={20} /> Your Work
          </button>

          <button
            onClick={() => setActiveSection('delete')}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeSection === 'delete'
                ? 'bg-red-100 text-red-600 font-semibold'
                : 'text-red-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <Trash2 size={20} /> Delete Account
          </button>
        </nav>
      </aside>

      {/* Dynamic Section */}
      <main className="flex-1 p-2">
        <h2 className="text-xl font-semibold mb-2 ml-4 text-gray-700">
          Profile Settings
        </h2>
        {renderSection()}
      </main>
    </div>
  )
}

export default Profile
