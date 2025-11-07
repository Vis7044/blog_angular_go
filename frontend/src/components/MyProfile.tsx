import React, { useState } from 'react'
import { Camera, Edit3 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatars } from './Avatars'
import { EditProfileModal } from './EditProfileModal'

const MyProfile = () => {
  const { user } = useAuth()
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [profilePic, setProfilePic] = useState(user?.profilePic || '')


  const handleSaveProfile = (values: any) => {
    console.log('Updated profile:', values)
    // 🔹 You can send `values` + `profilePic` to backend API here
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-4">
        <h3 className="text-lg font-semibold text-gray-700">My Profile</h3>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Edit3 size={16} />
          Edit Details
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture */}
        <div
          className="relative w-32 h-32 group rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm cursor-pointer"
          onClick={() => setIsAvatarModalOpen(!isAvatarModalOpen)}
        >
          <img
            src={profilePic || '/default-avatar.png'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="text-white w-8 h-8" />
          </div>
        </div>

        {isAvatarModalOpen && (
          <Avatars
            onClose={() => setIsAvatarModalOpen(false)}
            onSelect={(url) => setProfilePic(url)}
          />
        )}

        {/* User Info */}
        <div className="flex flex-col flex-1">
          <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
          <p className="text-gray-500 text-sm font-sans">@{user?.username}</p>
          <p className="text-sm text-gray-600 mt-2">{user?.bio}</p>
          <p className="text-sm text-indigo-600 mt-2 font-medium">3 Followers</p>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Address</h4>
        <p className="text-gray-700 text-sm">
           
            '123, Palm Residency, Sector 62, Noida, Uttar Pradesh, India – 201309'
        </p>
      </div>

      {/* Top Blogs Section */}
      {/* (unchanged) ... */}

      {/* Edit Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  )
}

export default MyProfile
