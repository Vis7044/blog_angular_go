'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

export const VerifyOtpForm = ({
  email,
  onVerified,
}: {
  email: string
  onVerified: () => void
}) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return toast.error('Enter the OTP.')

    setLoading(true)
    try {
      //await authService.verifyOtp({ email, otp })
      toast.success('OTP verified! You can now reset your password.')
      onVerified()
    } catch (error) {
      console.error(error)
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white w-full rounded-2xl p-6 space-y-5 border border-gray-100">
      <h2 className="text-xl font-semibold text-center text-gray-900">
        Verify OTP
      </h2>
      <p className="text-center text-sm text-gray-500">
        Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition text-center tracking-widest"
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
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  )
}
