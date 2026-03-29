"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Reports", href: "/dashboard/reports" },
  ];

  return (
    <div className="w-64 p-5 text-white" style={{ background: "var(--primary)" }}>
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
  );
}