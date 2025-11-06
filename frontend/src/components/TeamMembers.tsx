import React from 'react'
import { Circle } from 'lucide-react'

const TeamMembers = () => {
  const members = [
    {
      name: 'Aarav Sharma',
      role: 'Frontend Developer',
      bio: 'Specializes in React and Tailwind UI design.',
      img: 'https://randomuser.me/api/portraits/men/31.jpg',
      status: 'Online',
    },
    {
      name: 'Riya Patel',
      role: 'Backend Engineer',
      bio: 'Expert in Node.js and database optimization.',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'Offline',
    },
    {
      name: 'Karan Singh',
      role: 'UI/UX Designer',
      bio: 'Passionate about crafting intuitive interfaces.',
      img: 'https://randomuser.me/api/portraits/men/56.jpg',
      status: 'Online',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
        Team Members
      </h3>

      {/* Member Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5"
          >
            {/* Profile Image */}
            <div className="relative">
              <img
                src={m.img}
                alt={m.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
              />
              <span
                className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                  m.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'
                } border-2 border-white`}
                title={m.status}
              ></span>
            </div>

            {/* Name & Role */}
            <div className="mt-3">
              <p className="font-semibold text-gray-800">{m.name}</p>
              <p className="text-sm text-indigo-600 font-medium">{m.role}</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 mt-2">{m.bio}</p>

            {/* Status */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
              <Circle
                size={10}
                className={m.status === 'Online' ? 'text-green-500 fill-green-500' : 'text-gray-400'}
              />
              {m.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamMembers
