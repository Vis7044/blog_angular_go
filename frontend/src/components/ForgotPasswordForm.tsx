'use client'

import { useState } from 'react'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export const ForgotPasswordForm = ({
  onOtpSent,
  onBack,
}: {
  onOtpSent: (email: string) => void
  onBack: () => void
}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Email is required')
      return
    }


    setLoading(true)
    try {
      // ✅ Call your API to send OTP
      const response = { data: { success: true } }
      if (response.data.success) {
        toast.success('OTP sent to your email')
        onOtpSent(email)
      } else {
        toast.error('Failed to send OTP')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white w-[23rem] rounded-2xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Forgot Password?</h2>
        <p className="text-sm text-gray-500">
          Enter your email address to receive an OTP
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
          } transition duration-150`}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 rounded-md border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
        >
          ← Back to Login
        </button>
      </form>
    </div>
  )
}
