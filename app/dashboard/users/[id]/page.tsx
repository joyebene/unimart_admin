"use client";

import { Button } from "@/components/shared/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDetails, UpdateUserStatus } from "@/lib/api";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Phone,
  ShoppingBag,
  ShieldCheck,
  ShieldX,
  CircleUser,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  createdAt?: string;
  productCount?: number;
  status: "active" | "banned";
}

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUser = async () => {
    // Don't set loading to true on refetch, to avoid UI flicker
    if (!user) {
      setLoading(true);
    }
    try {
      const data = await getUserDetails(id as string);
      setUser(data.data || data);
      console.log(user);
      
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleToggleSuspension = async () => {
    if (!user) return;

    setIsUpdating(true);
   console.log(user);
   
    const newStatus = user.status === "active" ? "banned" : "active";

    try {
      await UpdateUserStatus(id as string, newStatus);

      // Refetch user data to show the updated status
      await fetchUser();
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("There was an error updating the user's status.");
    } finally {
      setIsUpdating(false);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="bg-(--card-background) md:mt-20 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Profile Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-(--primary)"
            />
          ) : (
            <CircleUser className="w-32 h-32 text-(--secondary-text)" />
          )}
          <h1 className="text-2xl font-bold mt-4">{user.fullName}</h1>
          <p className="text-(--secondary-text)">{user.email}</p>
          {user.bio && (
            <p className="mt-4 text-sm text-center">{user.bio}</p>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status Card */}
            <div className="bg-(--soft-background) p-4 rounded-lg flex items-center gap-4">
              {user.status === "banned" ? (
                <ShieldX className="w-8 h-8 text-(--error)" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-(--success)" />
              )}
              <div>
                <p className="text-sm text-(--secondary-text)">Status</p>
                <p className="font-bold text-lg">
                  {user.status === "banned" ? "Suspended" : "Active"}
                </p>
              </div>
            </div>

            {/* Product Count Card */}
            <div className="bg-(--soft-background) p-4 rounded-lg flex items-center gap-4">
              <ShoppingBag className="w-8 h-8 text-(--secondary)" />
              <div>
                <p className="text-sm text-(--secondary-text)">Products</p>
                <p className="font-bold text-lg">{user.productCount ?? 0}</p>
              </div>
            </div>

            {/* Location */}
            {user.location && (
              <div className="bg-(--soft-background) p-4 rounded-lg flex items-center gap-4">
                <MapPin className="w-8 h-8 text-(--secondary)" />
                <div>
                  <p className="text-sm text-(--secondary-text)">Location</p>   
                  <p className="font-bold">{user.location}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {user.phone && (
              <div className="bg-(--soft-background) p-4 rounded-lg flex items-center gap-4">
                <Phone className="w-8 h-8 text-(--secondary)" />
                <div>
                  <p className="text-sm text-(--secondary-text)">Phone</p>
                  <p className="font-bold">{user.phone}</p>
                </div>
              </div>
            )}
            
            {/* Joined Date */}
            {user.createdAt && (
                <div className="bg-(--soft-background) p-4 rounded-lg flex items-center gap-4">
                    <CalendarDays className="w-8 h-8 text-(--secondary)" />
                    <div>
                        <p className="text-sm text-(--secondary-text)">Joined</p>
                        <p className="font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 border-t border-(--border-color) pt-6">
            <h2 className="text-lg font-semibold mb-4">Manage User</h2>
            <Button
              onClick={handleToggleSuspension}
              disabled={isUpdating}
              variant={user.status === "banned" ? "default" : "destructive"}
              className={`w-full md:w-auto ${user.status === "banned" ? 'bg-(--success) hover:bg-(--success)/90' : ''}`}>
              {isUpdating
                ? "Updating..."
                : user.status === "banned"
                ? "Activate User"
                : "Suspend User"}
            </Button>
            <p className="text-xs text-(--hint-text) mt-2">
              {user.status === "banned"
                ? "Activating the user will restore their access."
                : "Suspending the user will block their access to the platform."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}