import React from 'react'

const DeleteAccount = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-red-600 border-b border-gray-200 pb-2">
        Delete Account
      </h3>
      <p className="text-gray-600 mb-6">
        Once you delete your account, all your data and posts will be permanently removed. This action cannot be undone.
      </p>
      <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all">
        Delete My Account
      </button>
    </div>
  )
}

export default DeleteAccount
