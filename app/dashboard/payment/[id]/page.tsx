"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPaymentDetails, updatePaymentStatus } from "@/lib/api";
import Image from "next/image";


export interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Payment {
  id: string;
  userId: string;
  user?: User;
  type: "boost" | "featurebadge";
  reference: string;
  amount: number;
  proof?: string;
  cloudinaryId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export default function PaymentDetails() {
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) return;
    const fetchPayment = async () => {
      try {
        const res = await getPaymentDetails(id);

        setPayment(res.payment || null);
        setProduct(res.product || null);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
        alert("Failed to fetch payment");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handleStatusChange = async (status: "pending" | "completed" | "failed") => {
    try {
     await updatePaymentStatus(id!, status);
     
      alert(`Payment status updated to ${status}`);
      setPayment({ ...payment!, status });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  if (!id) return <p>Payment ID not provided</p>;
  if (loading) return <p>Loading payment...</p>;
  if (!payment) return <p>Payment not found</p>;

  return (
    <div className="bg-(--card-background) p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>

      <div className="flex justify-between mt-10 max-w-2/3">
        <div className="mb-4">
          <h2 className="font-semibold">User Information</h2>
          <p><strong>Name:</strong> {payment.user?.fullName || payment.userId}</p>
          <p><strong>Email:</strong> {payment.user?.email || "N/A"}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Payment Information</h2>
          <p><strong>Type:</strong> {payment.type}</p>
          <p><strong>Amount:</strong> ₦{payment.amount.toLocaleString()}</p>
          <p><strong>Reference:</strong> {payment.reference}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`px-2 py-1 rounded ${payment.status === "completed"
                ? "bg-green-100 text-green-700"
                : payment.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
              {payment.status}
            </span>
          </p>
          <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
        </div>

      </div>

      {product && (
        <div className="mb-4">
          <h2 className="font-semibold">Product</h2>

          <div className="flex items-center gap-4 mt-2">
            <Image
              src={product.imageUrl}
              alt="product image"
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-lg border border-(--border-color)"
            />

            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-gray-600">
                ₦{product?.price?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-semibold">Proof Screenshot(s)</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          <Image
            key={payment.cloudinaryId}
            src={payment.proof || ""}
            alt="proof screenshot"
            width={480}
            height={480}
            className="w-48 h-48 object-cover rounded-lg border border-(--border-color)"
          />

        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleStatusChange("completed")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Mark as Completed
        </button>
        <button
          onClick={() => handleStatusChange("failed")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Mark as Failed
        </button>
      </div>
    </div>
  );
}