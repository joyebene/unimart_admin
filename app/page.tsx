"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import Image from "next/image";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  try {
    const data = await adminLogin(email, password);
    
    // Save token in localStorage or cookie
    localStorage.setItem("adminToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    router.push("/dashboard");
  } catch (err: any) {
    alert(err.message);
  }
  setLoading(false);
};


  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE (FORM) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-(--scaffold-background) p-6">
        
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-(--card-background)">
          
          <Image
            src="/unimart.png"
            width={150}
            height={150}
            alt="App Logo"
            className="mx-auto mb-6"
          />

          <h1 className="text-2xl font-bold mb-6 lg:mb-10 text-center">
            Admin Login
          </h1>

          <Input
            type="email"
            placeholder="Email"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            className="mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE (IMAGE) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/unimart-img2.jpg"
          alt="Auth Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}