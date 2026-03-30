"use client";

import { Button } from "@/components/shared/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getReports } from "@/lib/api";


export type ReportStatus = "pending" | "reviewed" | "closed";

export interface Reporter {
  id: string;
  fullName: string;
  email: string;
}

export interface Report {
  id: string;
  reporter?: Reporter;
  reportedId: string;
  type: "product" | "user";
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportsResponse {
  reports: Report[];
}

export interface ReportResponse {
  report: Report;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data.data || data);
      console.log(data.data);
      
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-(--card-background) rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-400">
            <tr className="text-left">
              <th className="p-4">Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-gray-300">
                <td className="p-4 capitalize">{report.type}</td>

                <td>{report.reason}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : report.status === "reviewed"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <Link href={`/dashboard/reports/${report.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}