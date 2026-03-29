"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/shared/button";
import {
  getReportDetails,
  updateReportStatus,
  getUserDetails,
  getProductDetails,
  deleteProduct,
  UpdateUserStatus,
} from "@/lib/api";
import { Report } from "../page";
import { Product } from "../../products/page";
import { User } from "../../users/page";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [target, setTarget] = useState<User | Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Report ID is missing.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchReportData = async () => {
      try {
        const data = await getReportDetails(id as string);
        const reportData = data.data || data;
        

        if (!isMounted) return;
        setReport(reportData);

        console.log(reportData);
        

        // Fetch target based on type
        if (reportData.type === "user") {
          const user = await getUserDetails(reportData.reportedId);
          if (isMounted) setTarget(user.data || user);
        } else if (reportData.type === "product") {
          const product = await getProductDetails(reportData.reportedId);
          if (isMounted) setTarget(product.data || product);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to fetch report details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReportData();
    

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusUpdate = async (status: "reviewed" | "closed") => {
    if (!report) return;
    try {
      await updateReportStatus(id as string, status);
      setReport({ ...report, status });
      alert(`Report status updated to ${status}.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleSuspendUser = async () => {
    if (!target || !("email" in target)) return; // Ensure target is a User
    const confirmSuspend = confirm(
      `Are you sure you want to suspend ${target.fullName}? This will ban their account.`
    );
    if (!confirmSuspend) return;

    try {
      await UpdateUserStatus(target.id, "banned");
      alert("User has been suspended.");
      // Refetch the target to update its status locally
      const user = await getUserDetails(target.id);
      setTarget(user.user || user);
    } catch (err) {
      console.error("Failed to suspend user:", err);
      alert("Failed to suspend user.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!target || !("price" in target)) return; // Ensure target is a Product
    const confirmDelete = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(target.id);
      alert("Product deleted successfully.");
      router.push("/dashboard/reports");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (isLoading) return <p>Loading report...</p>;
  if (error) return <p className="text-(--error)">{error}</p>;
  if (!report) return <p>No report found.</p>;

  return (
    <div className="bg-(--card-background) p-6 rounded-xl space-y-6 shadow-lg">
      <h1 className="text-2xl font-bold border-b border-[(--border-color)] pb-3">
        Report Details
      </h1>

      {/* Report Info */}
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Type:</strong> <span className="capitalize">{report.type}</span></p>
        <p><strong>Status:</strong> <span className={`capitalize font-semibold ${report.status === 'closed' ? 'text-(--secondary-text)' : 'text-(--success)'}`}>{report.status}</span></p>
        <p className="col-span-2"><strong>Reason:</strong> {report.reason}</p>
        <p className="col-span-2">
          <strong>Date:</strong>{" "}
          {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Reporter */}
      <div className="border-t border-(--border-color) pt-4">
        <h2 className="font-semibold text-lg">Reported By</h2>
        <p>{report.reporter?.fullName}</p>
        <p className="text-sm text-(--secondary-text)">
          {report.reporter?.email}
        </p>
      </div>

      {/* Target */}
      <div className="border-t border-(--border-color) pt-4">
        <h2 className="font-semibold text-lg mb-2">Reported {report.type === 'user' ? 'User' : 'Product'}</h2>

        {report.type === "user" && target && "email" in target && (
          <div className="p-4 bg-(--soft-background) rounded-lg">
            <p><strong>Name:</strong> {target.fullName}</p>
            <p><strong>Email:</strong> {target.email}</p>
            <p><strong>Status:</strong> <span className="capitalize">{target.status}</span></p>

            <div className="mt-3 flex gap-3">
              <Button 
                onClick={() => router.push(`/dashboard/users/${report.reportedId}`)} 
                variant="outline"
              >
                View User Details
              </Button>
              {target.status !== 'banned' && (
                <Button onClick={handleSuspendUser} className="bg-(--error) hover:bg-(--error)/90">
                  Suspend User
                </Button>
              )}
            </div>
          </div>
        )}

        {report.type === "product" && target && "price" in target && (
          <div className="p-4 bg-(--soft-background) rounded-lg">
            <p><strong>Name:</strong> {target.name}</p>
            <p><strong>Price:</strong> ₦{target.price.toLocaleString()}</p>

            <div className="mt-3 flex gap-3">
              <Button 
                onClick={() => router.push(`/dashboard/products/${report.reportedId}`)} 
                variant="outline"
              >
                View Product Details
              </Button>
              <Button
                onClick={handleDeleteProduct}
                className="bg-(--error) hover:bg-(--error)/90"
              >
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Actions */}
      {report.status !== 'closed' && (
        <div className="border-t border-(--border-color) pt-4 flex items-center gap-4">
          <h2 className="text-lg font-semibold">Actions</h2>
          {report.status === 'pending' && (
            <Button onClick={() => handleStatusUpdate("reviewed")} variant="outline">
              Mark as Reviewed
            </Button>
          )}
          <Button onClick={() => handleStatusUpdate("closed")} variant="outline">
            Close Report
          </Button>
        </div>
      )}
    </div>
  );
}