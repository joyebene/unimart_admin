"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Reports", href: "/dashboard/reports" },
  ];

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("adminToken");
    // Redirect to the login page
    router.push("/");
  };

  return (
    <div className="w-64 p-5 text-white flex flex-col h-full min-h-screen" style={{ background: "var(--primary)" }}>
      <div>
        <h2 className="text-xl font-bold mb-8">Unimart Admin</h2>

        <nav className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    active ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at the bottom */}
      <div className="mt-auto pt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-white/10 text-left text-red-100 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}