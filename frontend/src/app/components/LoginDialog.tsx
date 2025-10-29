'use client'
import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

export const LoginDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean
  setVisible: (v: boolean) => void
}) => {
  const [isLogin, setIsLogin] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl p-6 relative shadow-lg">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Let&apos;s Get Started
        </h2>

        <div className="flex flex-col transition-all duration-300 justify-center items-center">
          {/* ✅ Pass setVisible to both forms */}
          {isLogin ? (
            <LoginForm onClose={() => setVisible(false)} />
          ) : (
            <SignupForm onClose={() => setVisible(false)} />
          )}

          <p className="mt-4 text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
