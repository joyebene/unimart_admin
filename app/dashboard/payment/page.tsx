"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPayments } from "@/lib/api";

export interface Payment {
    id: string;
    userId: string;
    type: "boost" | "featurebadge";
    reference: string;
    amount: number;
    proof?: { url: string; fileName: string }[];
    status: "pending" | "completed" | "failed";
    createdAt: string;
    user?: { fullName: string; email: string };
}

export default function PaymentsPage() {
    const router = useRouter();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await getPayments();


                // Ensure we always have an array
                const paymentsData = Array.isArray(res.payments) ? res.payments : res;


                setPayments(paymentsData || []);
            } catch (err) {
                console.error("Failed to fetch payments:", err);
                alert("Failed to fetch payments");
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) return <p>Loading payments...</p>;

    return (
        <div className="bg-(--card-background) p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">All Payments</h1>

            {payments.length === 0 ? (
                <p className="text-center text-gray-400 mt-6">No payments found.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-(--border-color)">
                            <th className="p-2">#</th>
                            <th className="p-2">User</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? payments.map((p, idx) => (
                            <tr
                                key={p.id}
                                className="border-b border-(--border-color) hover:bg-white/5 cursor-pointer"
                            >
                                <td className="p-2">{idx + 1}</td>
                                <td className="p-2">{p.user?.fullName || p.userId}</td>
                                <td className="p-2">{p.type}</td>
                                <td className="p-2">₦{p.amount.toLocaleString()}</td>
                                <td className="p-2">
                                     <span className={`p-2 rounded ${p.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : p.status === "failed"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {p.status}
                                </span> 
                                </td>
                              
                                <td className="p-2">{new Date(p.createdAt).toLocaleString()}</td>
                                <td className="p-2">
                                    <button
                                        className="px-3 py-1 bg-(--primary) rounded text-white"
                                        onClick={() => router.push(`/dashboard/payment/${p.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <div className="w-full text-center">
                                <p className="text-center text-gray-400 mt-6">No payments found.</p>
                            </div>

                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}