"use client";

import { useEffect, useState } from "react";
import { getSupportMessages, updateSupportMessageStatus } from "@/lib/api";
import { toast } from "sonner";

// Define TypeScript types
interface User {
  id: string;
  fullName: string;
  email: string;
}

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  user: User;
}

type Status = "PENDING" | "IN_PROGRESS" | "RESOLVED";

const statusColors: Record<Status, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  RESOLVED: "bg-green-500/10 text-green-500 border-green-500/20",
};

export default function SupportMessagesPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getSupportMessages();

        const fetchedMessages = data.data || [];
        setMessages(fetchedMessages);
        setError(null);
      } catch (err) {
        setError("Failed to fetch support messages.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Status) => {
    const originalMessages = [...messages];
    // Optimistically update the UI
    setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));

    try {
      await updateSupportMessageStatus(id, newStatus);
      toast.success("Status updated successfully!");
    } catch (error) {
      // Revert the change if the API call fails
      setMessages(originalMessages);
      toast.error("Failed to update status. Please try again.");
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading support messages...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Support Inbox</h1>

      <div className="bg-(--card-background) shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-(--border-color)">
          <thead className="bg-(--table-header)">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">User</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Subject & Message</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-color)">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-(--hover-background) transition">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-semibold">{msg.user.fullName}</div>
                    <div className="text-sm text-(--secondary-text)">{msg.user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold mb-1">{msg.subject}</div>
                    <p className="max-w-md whitespace-pre-wrap text-sm text-(--secondary-text)">{msg.message}</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select
                      aria-label="Status"
                      value={msg.status}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value as Status)}
                      className={`p-2 rounded-md border text-xs font-medium cursor-pointer ${statusColors[msg.status]}`}
                      style={{ background: 'transparent' }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-(--secondary-text)">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-(--secondary-text)">
                  No support messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}