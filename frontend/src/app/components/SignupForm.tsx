'use client'

export const SignupForm = () => {
  return (
    <form className="flex flex-col space-y-3 w-full max-w-sm">
      <input
        type="text"
        placeholder="Name"
        className="border border-gray-300 rounded-md p-2"
      />
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
        className="bg-green-600 text-white rounded-md py-2 hover:bg-green-700"
      >
        Sign Up
      </button>
    </form>
  )
}
