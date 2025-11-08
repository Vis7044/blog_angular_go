'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

export const ResetPasswordForm = ({
  email,
  onSuccess,
}: {
  email: string
  onSuccess: () => void
}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword)
      return toast.error('Please fill out both fields.')
    if (password !== confirmPassword)
      return toast.error('Passwords do not match.')

    setLoading(true)
    try {
      await authService.resetPassword( email, password )
      toast.success('Password reset successful! Please login again.')
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-5 border border-gray-100">
      <h2 className="text-xl font-semibold text-center text-gray-900">
        Reset Password
      </h2>
      <p className="text-center text-sm text-gray-500">
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
          } transition duration-150`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
