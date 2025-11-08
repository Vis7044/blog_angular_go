'use client'

import { useState } from 'react'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const SignupForm = ({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void
  onSwitchToLogin?: () => void
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required.'
    if (!formData.email.trim()) newErrors.email = 'Email is required.'
    else if (
      !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|live\.com)$/i.test(
        formData.email
      )
    )
      newErrors.email = 'Please use a valid email.'
    if (!formData.password) newErrors.password = 'Password is required.'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await authService.signup(formData)
      toast.success(`Welcome ${result.data.name || formData.name}!`)
      // 👇 Instead of closing, go back to login form
      onSwitchToLogin?.()
    } catch (error) {
      console.error('Signup failed:', error)
      toast.error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white w-[23rem] rounded-2xl p-4">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Create an account</h2>
        <p className="text-sm text-gray-500">Enter your details below to sign up</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Alice"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full border ${
              errors.name ? 'border-red-400' : 'border-gray-300'
            } rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="mymail@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full border ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            } rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full border ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            } rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
          } transition duration-150`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* Google Signup */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50 transition"
        >
          Sign up with Google
        </button>
      </form>
        
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-gray-800 underline hover:text-black"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
