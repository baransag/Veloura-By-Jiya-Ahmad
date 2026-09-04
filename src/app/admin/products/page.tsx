"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";

export default function AdminProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTogglePublish = async (product: any) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DA9413] font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl text-white mt-1">Atelier Products</h1>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#750A0A] hover:bg-[#8E1137] text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition-colors border border-[#DA9413]/30"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Loading catalog from database...</div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-[#1A1615] rounded-xl border border-white/10 space-y-3">
          <Sparkles className="w-8 h-8 text-[#DA9413] mx-auto opacity-60" />
          <p className="font-serif text-lg text-white">No Products in Atelier</p>
          <p className="text-xs text-zinc-400">Add a product to instantly display it on your live storefront.</p>
          <Link
            href="/admin/products/new"
            className="inline-block mt-3 px-5 py-2.5 bg-[#750A0A] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-[#1A1615] rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] bg-black/20">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-14 rounded bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                        {prod.images?.[0]?.url && (
                          <img src={prod.images[0].url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{prod.name}</p>
                        <p className="text-zinc-500 font-mono text-[10px]">{prod.sku || "NO SKU"}</p>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">{prod.category?.name || "Uncategorized"}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        Rs. {(prod.salePrice || prod.price).toLocaleString()}
                      </div>
                      {prod.salePrice && (
                        <div className="text-[10px] text-zinc-500 line-through">
                          Rs. {prod.price.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          prod.stock <= 3 ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(prod)}
                        className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1.5 transition-colors ${
                          prod.isPublished
                            ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {prod.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {prod.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
