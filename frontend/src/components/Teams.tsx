import React from 'react'
import { Users } from 'lucide-react'

const Teams = () => {
  const createdTeams = [
    {
      name: 'Hackathon Heroes',
      description: 'Team of top coders participating in inter-college hackathons.',
      members: 6,
      role: 'Admin',
    },
  ]

  const joinedTeams = [
    {
      name: 'Dev Innovators',
      description: 'Collaborating on open-source MERN stack projects.',
      members: 8,
      role: 'Member',
    },
    {
      name: 'UI Visionaries',
      description: 'Design-focused devs creating stunning interfaces.',
      members: 5,
      role: 'Member',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
        Teams
      </h3>

      {/* Teams Created Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Teams You Created</h4>
        {createdTeams.length > 0 ? (
          <div className="grid gap-4">
            {createdTeams.map((team, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex justify-between items-start"
              >
                <div>
                  <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                    {team.name}
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                      Owner
                    </span>
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <Users size={14} className="inline-block mr-1" />
                    {team.members} members
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600 mt-1">{team.role}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">You haven’t created any teams yet.</p>
        )}
      </div>

      {/* Teams Joined Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Teams You’re a Member Of</h4>
        {joinedTeams.length > 0 ? (
          <div className="grid gap-4">
            {joinedTeams.map((team, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex justify-between items-start"
              >
                <div>
                  <h5 className="font-semibold text-gray-800">{team.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <Users size={14} className="inline-block mr-1" />
                    {team.members} members
                  </p>
                </div>
                <span className="text-xs font-medium text-blue-600 mt-1">{team.role}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">You’re not part of any team yet.</p>
        )}
      </div>
    </div>
  )
}

export default Teams
