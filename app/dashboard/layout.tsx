"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: {children: React.ReactNode;}) {
     const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-(--card-background)">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-(--card-background) border-b border-(--border-color) flex items-center justify-between">
          <h1 className="font-semibold">Admin Dashboard</h1>
          <Image src="/unimart.png" width={60} height={60} alt="img" />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}