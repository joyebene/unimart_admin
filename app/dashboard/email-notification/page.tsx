"use client";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { sendEmailNotification } from "@/lib/api";
import { useState } from "react";


export default function SendEmailPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !body) {
      setMessage("Subject and body are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await sendEmailNotification(
        subject,
        body,
        limit || undefined // optional
      );

      setMessage("Emails sent successfully");
      setSubject("");
      setBody("");
      setLimit("");
    } catch (error: any) {
      setMessage(error?.message || "❌ Failed to send emails");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Send Email Campaign</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block mb-1 text-sm font-medium">Subject</label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2"
            placeholder="Enter email subject"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block mb-1 text-sm font-medium">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2 h-32"
            placeholder="Write your message (HTML supported)"
          />
        </div>

        {/* Limit */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Limit (optional)
          </label>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full border border-gray-500 rounded-lg p-2"
            placeholder="default is at 50"
          />
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Emails"}
        </Button>
      </form>

      {/* Feedback */}
      {message && (
        <p className="mt-4 text-sm text-center">{message}</p>
      )}
    </div>
  );
}