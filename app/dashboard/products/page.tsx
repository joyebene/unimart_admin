"use client";

import { Button } from "@/components/shared/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/api";


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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="bg-(--card-background) rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-400">
            <tr className="text-left">
              <th className="p-4">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-300">
                <td className="p-4">
                  <Image
                    src={product.imageUrl}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded object-cover"
                    alt="product image"
                  />
                </td>

                <td>{product.name}</td>

                <td className="text-(--price) font-semibold">
                  ₦{product.price}
                </td>

                <td>{product.seller?.fullName}</td>

                <td className="space-x-2">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>

                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="text-(--error)"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}