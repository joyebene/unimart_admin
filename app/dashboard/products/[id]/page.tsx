"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductDetails, deleteProduct } from "@/lib/api";

export interface Seller {
  id: string;
  fullName: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl: string;
  imageCloudinaryId: string;
  seller: Seller;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const data = await getProductDetails(id as string);
        if (isMounted) {
          setProduct(data.data || data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch product:", err);
          alert("Failed to fetch product");
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id as string);
      alert("Product deleted successfully.");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={product.imageUrl}
          width={250}
          height={250}
          className="w-full md:w-64 h-64 object-cover rounded-lg border border-[var(--border-color)]"
          alt={product.name}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-[var(--price)] text-2xl font-semibold mt-1">
            ₦{product.price.toLocaleString()}
          </p>
          <p className="mt-4 text-[var(--secondary-text)]">
            {product.description}
          </p>

          <div className="mt-6 border-t border-[var(--border-color)] pt-4">
            <h2 className="text-lg font-semibold">Seller Information</h2>
            <p className="mt-2">
              <strong>Name:</strong> {product.seller?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {product.seller?.email}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="mt-6 px-6 py-2 bg-[var(--error)] text-white rounded-lg hover:bg-[var(--error)]/90 transition-colors font-semibold"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}