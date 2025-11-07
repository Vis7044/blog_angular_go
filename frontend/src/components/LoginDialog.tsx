'use client'
import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { VerifyOtpForm } from './VerifyOtpForm'
import { ResetPasswordForm } from './ResetPasswordForm'

export const LoginDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean
  setVisible: (v: boolean) => void
}) => {
  const [step, setStep] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'reset'>('login')
  const [resetEmail, setResetEmail] = useState('')

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl p-6 relative shadow-lg w-[25rem] max-w-full">
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

        <div className="flex flex-col justify-center items-center">
          {step === 'login' && (
            <LoginForm
              onClose={() => setVisible(false)}
              onForgot={() => setStep('forgot')}
              onSwitchToSignup={() => setStep('signup')}
            />
          )}

          {step === 'signup' && (
            <SignupForm
              onClose={() => setVisible(false)}
              onSwitchToLogin={() => setStep('login')}
            />
          )}

          {step === 'forgot' && (
            <ForgotPasswordForm
            onOtpSent={(email) => {
              setResetEmail(email)
              setStep('otp')
            }}
            onBack={() => setStep('login')}
          />
          )}

          {step === 'otp' && (
            <VerifyOtpForm
              email={resetEmail}
              onVerified={() => setStep('reset')}
            />
          )}

          {step === 'reset' && (
            <ResetPasswordForm
              email={resetEmail}
              onSuccess={() => setStep('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
