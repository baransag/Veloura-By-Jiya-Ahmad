"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Sparkles, Pencil, Search, Check, X, Tag } from "lucide-react";

export default function AdminProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Quick Price Modal State
  const [editingPriceProd, setEditingPriceProd] = useState<any | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [newSalePrice, setNewSalePrice] = useState("");
  const [priceSaving, setPriceSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  const openPriceModal = (prod: any) => {
    setEditingPriceProd(prod);
    setNewPrice(prod.price?.toString() || "");
    setNewSalePrice(prod.salePrice ? prod.salePrice.toString() : "");
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceProd) return;
    try {
      setPriceSaving(true);
      await fetch(`/api/admin/products/${editingPriceProd.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: parseFloat(newPrice),
          salePrice: newSalePrice ? parseFloat(newSalePrice) : null,
        }),
      });
      setEditingPriceProd(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setPriceSaving(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "ALL" ||
      (p.category && (p.category.slug === categoryFilter || p.category.name === categoryFilter));

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name || "Uncategorized"))
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
            Catalog & Price Controller
          </span>
          <h1 className="font-serif text-3xl text-white mt-1">Atelier Products</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Total {products.length} products with WhatsApp images. Set and adjust prices in PKR.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#1A1615] border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              categoryFilter === "ALL"
                ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C2185B]"
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Loading catalog from atelier...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#1A1615] rounded-3xl border border-white/10 space-y-3">
          <Sparkles className="w-8 h-8 text-[#C2185B] mx-auto opacity-70 animate-pulse" />
          <p className="font-serif text-lg text-white">No Products Found</p>
          <p className="text-xs text-zinc-400">Try changing your search keywords or filter tab.</p>
        </div>
      ) : (
        <div className="bg-[#1A1615] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] bg-black/20">
                  <th className="p-4">Product & Visual</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (PKR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-14 h-16 rounded-xl bg-black/40 overflow-hidden flex-shrink-0 border border-white/10 relative group">
                        {prod.images?.[0]?.url && (
                          <img
                            src={prod.images[0].url}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        {prod.images && prod.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1 rounded">
                            +{prod.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{prod.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-zinc-500 font-mono text-[10px]">{prod.sku || "NO SKU"}</span>
                          {prod.isFeatured && (
                            <span className="bg-[#8E1B3B]/40 text-[#F4A6B8] border border-[#8E1B3B]/50 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px]">
                        {prod.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-white text-sm">
                            Rs. {(prod.salePrice || prod.price).toLocaleString()}
                          </div>
                          {prod.salePrice && (
                            <div className="text-[10px] text-zinc-500 line-through">
                              Rs. {prod.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => openPriceModal(prod)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#8E1B3B]/40 text-zinc-400 hover:text-[#F4A6B8] transition-colors border border-white/5"
                          title="Quick Edit Price"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
                        >
                          Full Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Price Adjust Modal */}
      {editingPriceProd && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1615] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingPriceProd(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
                Quick Price Adjustment
              </span>
              <h2 className="font-serif text-xl text-white mt-1 line-clamp-1">
                {editingPriceProd.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Update standard and promotional sale price in Pakistani Rupees (PKR).
              </p>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Regular Price (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    placeholder="e.g. 2950"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Promotional Sale Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="Optional (e.g. 2450)"
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Leave blank to sell at the regular standard price.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPriceProd(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={priceSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {priceSaving ? "Saving..." : "Update Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
