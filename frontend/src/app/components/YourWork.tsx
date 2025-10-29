import React from 'react'
import { FolderCode, CheckCircle2, Loader2 } from 'lucide-react'

const YourWork = () => {
  const works = [
    {
      title: 'Blog Platform UI',
      status: 'Completed',
      description:
        'Designed and implemented a responsive blog interface using React and TailwindCSS.',
    },
    {
      title: 'Social App Backend',
      status: 'In Progress',
      description:
        'Building APIs and authentication logic for a college social networking platform using Node.js and MongoDB.',
    },
    {
      title: 'Event Management Dashboard',
      status: 'Completed',
      description:
        'Created a real-time admin dashboard to manage events, registrations, and analytics.',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
        Your Work
      </h3>

      {/* Work List */}
      <div className="space-y-4">
        {works.map((work, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all bg-gray-50"
          >
            {/* Left: Icon + Details */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FolderCode size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{work.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{work.description}</p>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div className="flex items-center gap-2">
              {work.status === 'Completed' ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <CheckCircle2 size={14} />
                  {work.status}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  <Loader2 size={14} className="animate-spin-slow" />
                  {work.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YourWork
