'use client'

import { authService } from '@/services/authService'
import { useState } from 'react'

export const SignupForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // ✅ Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = 'Full name is required.'
    if (!formData.email.trim()) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email address.'
    if (!formData.password) newErrors.password = 'Password is required.'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await authService.signup(formData)
      setMessage(`Signup successful! Welcome ${result.data.name || formData.name}.`)
    } catch (error) {
      setMessage('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden shadow-md w-[40rem] h-auto">
      {/* Left section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Create an Account ✨
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Join us and start your journey today.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`border ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              } focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 w-full transition`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`border ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              } focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 w-full transition`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`border ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              } focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 w-full transition`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white font-medium rounded-md py-2 mt-2 active:scale-[0.98] transition-transform duration-150`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {message && (
            <div className="text-center mt-2 text-sm">
              <p
                className={
                  message.includes('🎉')
                    ? 'text-green-600 bg-green-50 border border-green-200 rounded-md py-2'
                    : 'text-red-600 bg-red-50 border border-red-200 rounded-md py-2'
                }
              >
                {message}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Right section: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
        <img
          src="signupArt.jpg"
          alt="Signup illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
