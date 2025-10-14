'use client'

export const LoginForm = () => {
  return (
    <form className="flex flex-col space-y-3 w-full max-w-sm">
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded-md p-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  )
}
