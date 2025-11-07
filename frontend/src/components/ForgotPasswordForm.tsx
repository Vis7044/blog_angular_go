'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

export const ForgotPasswordForm = ({
  onOtpSent,
}: {
  onOtpSent: (email: string) => void
}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Please enter your email.')

    setLoading(true)
    try {
      // call backend API
      //await authService.sendOtp({ email })
      toast.success('OTP sent to your email.')
      onOtpSent(email)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-5 border border-gray-100">
      <h2 className="text-xl font-semibold text-center text-gray-900">
        Forgot Password
      </h2>
      <p className="text-center text-sm text-gray-500">
        Enter your registered email to receive an OTP.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}
