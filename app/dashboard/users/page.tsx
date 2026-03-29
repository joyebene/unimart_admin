"use client";

import { Button } from "@/components/shared/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import Image from "next/image";
import { UserCircle } from "lucide-react";

export interface User {
  id: string;
  avatarUrl: string;
  fullName: string;
  email: string;
  status: "active" | "banned";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      
      setUsers(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="bg-(--card-background) rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-4">Avatar</th>  
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td>
                    <div className="rounded">
                        {user.avatarUrl ? (
                            <Image src={user.avatarUrl} width={50} height={50} alt="user pics" className="w-12 h-12 rounded object-cover" />
                        ) : (
                            <UserCircle size={50} className="text-gray-300"  />
                        )}
                      
                    </div>
               
                </td>
                <td className="p-4">{user.fullName}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.status === "banned"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.status === "banned" ? "Banned" : "Active"}
                  </span>
                </td>

                <td className="space-x-2">
                  {user.id && (
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}