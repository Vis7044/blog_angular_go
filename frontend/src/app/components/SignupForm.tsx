'use client'

import { useState } from "react";

export const SignupForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) throw new Error("Please fill all fields");

      setSuccess("Account created successfully!");
      setError("");

      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden shadow-md w-[40rem] h-[24rem]">
      {/* Left section: Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Create an Account ✨
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Join us and start your journey today.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-center">
              {success}
            </p>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-100 rounded-md p-2 transition"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white font-medium rounded-md py-2 mt-2 hover:bg-green-700 active:scale-[0.98] transition-transform duration-150"
          >
            Sign Up
          </button>
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
  );
};
