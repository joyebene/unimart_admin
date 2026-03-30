"use client";

import { Button } from "@/components/shared/button";
import { UserCircle, Users, Package, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "./users/page";
import { getUsers, getProducts, getReports } from "@/lib/api";

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
      users: 0,
      products: 0,
      reports: 0,
    });
  
    const fetchDashboardData = async () => {
      try {
        // Load cached totals from local storage first
        const cachedTotals = localStorage.getItem("dashboardTotals");
        if (cachedTotals) {
          setTotals(JSON.parse(cachedTotals));
        }

        // Fetch all data concurrently
        const [usersRes, productsRes, reportsRes] = await Promise.allSettled([
          getUsers(),
          getProducts(),
          getReports(),
        ]);

        // Extract data arrays (handling potential API response structures)
        const usersData = usersRes.status === "fulfilled" ? (usersRes.value.data || usersRes.value || []) : [];
        const productsData = productsRes.status === "fulfilled" ? (productsRes.value.data || productsRes.value || []) : [];
        const reportsData = reportsRes.status === "fulfilled" ? (reportsRes.value.data || reportsRes.value || []) : [];

        const newTotals = {
          users: usersData.length || 0,
          products: productsData.length || 0,
          reports: reportsData.length || 0,
        };

        setTotals(newTotals);
        localStorage.setItem("dashboardTotals", JSON.stringify(newTotals));
        
        // Set users for the table
        setUsers(usersData);
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDashboardData();
    }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-(--card-background) shadow flex items-center justify-between">
          <div>
            <p className="text-(--secondary-text) font-medium">Users</p>
            <h2 className="text-3xl font-bold mt-2">{totals.users.toLocaleString()}</h2>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-(--card-background) shadow flex items-center justify-between">
          <div>
            <p className="text-(--secondary-text) font-medium">Products</p>
            <h2 className="text-3xl font-bold mt-2">{totals.products.toLocaleString()}</h2>
          </div>
          <div className="p-4 bg-green-500/10 rounded-full">
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-(--card-background) shadow flex items-center justify-between">
          <div>
            <p className="text-(--secondary-text) font-medium">Reports</p>
            <h2 className="text-3xl font-bold mt-2 text-(--error)">{totals.reports.toLocaleString()}</h2>
          </div>
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-(--error)" />
          </div>
        </div>
      </div>

       <div className="mt-20">
            <h1 className="text-2xl font-bold mb-6">Users</h1>
      
            <div className="bg-(--card-background) rounded-xl overflow-hidden shadow">
              <table className="w-full">
                <thead className="border-b border-gray-400">
                  <tr className="text-left">
                    <th className="p-4">Avatar</th>  
                    <th className="p-4">Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

               {loading && <div>Loading users...</div>}
        
      
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
    </div>
  );
}