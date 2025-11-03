'use client'

import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await authService.login({email, password});
      if (!resp.data.success) {
        throw new Error("Login failed");
      }
      await fetchUser();
      onClose();
      router.push("/");
    } catch (e) {
      setError("Invalid credentials");
      console.error("Login failed:", e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-white rounded-2xl overflow-hidden shadow-md w-[40rem] h-[24rem]">
      {/* Left section: Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to continue your journey.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md p-2 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md p-2 transition"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium rounded-md py-2 mt-2 hover:bg-blue-700 active:scale-[0.98] transition-transform duration-150"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Right section: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src="loginArt.jpg"
          alt="Login illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};
