import React from 'react'
import { Edit3 } from 'lucide-react'

const MyProfile = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-4">
        <h3 className="text-lg font-semibold text-gray-700">My Profile</h3>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
          <Edit3 size={16} />
          Edit Details
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm">
          <img
            src="https://example.com/uploads/profile/mithalesh.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col flex-1">
          <p className="text-lg font-medium text-gray-800">Mithalesh Kumar</p>
          <p className="text-gray-500">@mithalesh_dev</p>
          <p className="text-sm text-gray-600 mt-2">
            Full Stack Developer | Tech enthusiast | Love to build cool stuff 🚀
          </p>
          <p className="text-sm text-indigo-600 mt-2 font-medium">3 Followers</p>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Address</h4>
        <p className="text-gray-700 text-sm">
          123, Palm Residency, Sector 62,<br />
          Noida, Uttar Pradesh, India – 201309
        </p>
      </div>

      {/* Top Blogs Section */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Top Blogs</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <h5 className="font-semibold text-gray-800">How to Scale MERN Apps Efficiently</h5>
            <p className="text-sm text-gray-600 mt-1">
              A practical guide on optimizing MongoDB and React for better performance.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <h5 className="font-semibold text-gray-800">Exploring Next.js 14 Features</h5>
            <p className="text-sm text-gray-600 mt-1">
              A quick dive into the new app router and Turbopack optimizations.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <h5 className="font-semibold text-gray-800">Building UI with Tailwind + Shadcn</h5>
            <p className="text-sm text-gray-600 mt-1">
              Learn how to create aesthetic and responsive designs quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
