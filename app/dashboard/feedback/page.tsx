"use client";

import { useEffect, useState } from "react";
import { getFeedBacks } from "@/lib/api";
import { Star } from "lucide-react";

// Define the types for better type-checking
interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Feedback {
  id: string;
  message: string;
  rating: number;
  createdAt: string;
  user: User;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getFeedBacks();

        const fetchedFeedbacks = data.data || [];

        setFeedbacks(fetchedFeedbacks);
        setError(null);
      } catch (err) {
        setError("Failed to fetch feedbacks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-(--secondary-text)]">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Product Feedbacks</h1>

      <div className="bg-(--card-background)] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-(--border-color)">
          <thead className="bg-(--table-header)">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">User</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Feedback</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Rating</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-(--secondary-text) uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-color)">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-(--hover-background) transition">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-semibold">{feedback.user.fullName}</div>
                    <div className="text-sm text-(--secondary-text)]">{feedback.user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="max-w-md whitespace-pre-wrap">{feedback.message}</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {renderRating(feedback.rating)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-(--secondary-text)">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-(--secondary-text)">
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}