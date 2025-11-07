'use client'

import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const LoginForm = ({
  onClose,
  onForgot,
}: {
  onClose: () => void;
  onForgot: () => void;
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await authService.login({ email, password });
      if (!resp.data.success) throw new Error("Login failed");
      await fetchUser();
      toast.success("Login successful");
      router.push("/");
      onClose();
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-md p-8 space-y-6 border border-gray-100">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Login to your account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onForgot}
            >
              Forgot your password?
            </button>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 active:scale-[0.98]"
          } transition duration-150`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50 transition"
        >
          Login with Google
        </button>
      </form>
      
    </div>
  );
};
