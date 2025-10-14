'use client'
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginForm = () => {
    const router = useRouter();
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <form className="flex flex-col space-y-3 w-full max-w-sm">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder="Password"
        className="border border-gray-300 rounded-md p-2"
      />
      <button
        type="submit"
        onClick={()=>{
            login(email,password)
            router.push("/")
        }}
        className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  )
}
