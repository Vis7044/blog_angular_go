'use client'

import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

const avatars = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/x7w6y5fxjqlu2ymtciqb.png',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/b5ncqfgyzqj99sojluem.png',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/qlf2vn3jmfnrllb9gt80.png',
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/wcsgbajwbiujtrudbzvv.png',
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/li7nxwav5fxk61brwov0.png',
  },
  {
    id: 6,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/j9xmgnypfrqowmcsjrn0.png',
  },
  {
    id: 7,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/tdvwnsfjswazyxs41jhy.png',
  },
  {
    id: 8,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/wrihbw3svxvoruupbd8x.png',
  },
  {
    id: 9,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/ellzoi4mvk5bld8avgr2.png',
  },
  {
    id: 10,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/dfhan9doi2lte84unfgm.png',
  },
]

export const Avatars = ({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (url: string) => void
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = async () => {
    if (!selectedAvatar) return
    setLoading(true)
    try {
      // 🧠 Here you can call your backend API to update avatar
      // Example: await userService.updateAvatar(selectedAvatar)
      console.log('Selected avatar:', selectedAvatar)
      onSelect(selectedAvatar)
      onClose()
    } catch (error) {
      console.error('Error updating avatar:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-2xl w-[90%] max-w-2xl shadow-xl relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Choose Your Avatar
        </h2>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 justify-center">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="relative">
              <img
                src={avatar.url}
                alt="Avatar"
                className={`w-20 h-20 rounded-full cursor-pointer border-4 transition ${
                  selectedAvatar === avatar.url
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-gray-500'
                }`}
                onClick={() => setSelectedAvatar(avatar.url)}
              />
              {selectedAvatar === avatar.url && (
                <CheckCircle
                  className="absolute bottom-2 text-blue-500 bg-white rounded-full"
                  size={18}
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedAvatar || loading}
            className={`px-5 py-2 rounded-md text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } transition`}
          >
            {loading ? 'Saving...' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  )
}
