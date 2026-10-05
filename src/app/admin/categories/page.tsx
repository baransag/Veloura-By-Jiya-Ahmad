"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  PlusCircle,
  Gem,
  Flower2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [universe, setUniverse] = useState<"JEWELRY" | "BEAUTY_SKIN_HAIR">("BEAUTY_SKIN_HAIR");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, universe, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      setSuccess(`✓ Category "${name}" created! Now available in products & storefront.`);
      setName("");
      setDescription("");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess("");
        fetchCategories();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const beautyCategories = categories.filter((c) => c.universe === "BEAUTY_SKIN_HAIR");
  const jewelryCategories = categories.filter((c) => c.universe === "JEWELRY");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
            Atelier Taxonomy Management
          </span>
          <h1 className="font-serif text-3xl text-white mt-1">Categories & Wings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your store sections: Tag skincare & facewash into the Beauty Wing, and jewels into the Fine Jewellery Wing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Beauty & Skincare Wing */}
        <div className="bg-[#1A1615] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E14D75]/20 text-[#E14D75] flex items-center justify-center">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-white font-bold">Silk Skincare & Hair Wing</h2>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                  {beautyCategories.length} Categories Active
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setUniverse("BEAUTY_SKIN_HAIR");
                setIsModalOpen(true);
              }}
              className="text-xs text-[#E14D75] hover:underline font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {beautyCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-[#E14D75]/40 transition-all"
              >
                <div>
                  <div className="font-bold text-white text-sm">{cat.name}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-1">{cat.description || "Active Category"}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">slug: {cat.slug}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/new?categoryName=${encodeURIComponent(cat.name)}&universe=BEAUTY_SKIN_HAIR`}
                    title="Add product to this category"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    title="Delete category"
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fine Jewellery Wing */}
        <div className="bg-[#1A1615] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C2185B]/20 text-[#C2185B] flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-white font-bold">Fine Jewellery Wing</h2>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                  {jewelryCategories.length} Categories Active
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setUniverse("JEWELRY");
                setIsModalOpen(true);
              }}
              className="text-xs text-[#C2185B] hover:underline font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {jewelryCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-[#C2185B]/40 transition-all"
              >
                <div>
                  <div className="font-bold text-white text-sm">{cat.name}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-1">{cat.description || "Active Category"}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">slug: {cat.slug}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/new?categoryName=${encodeURIComponent(cat.name)}&universe=JEWELRY`}
                    title="Add product to this category"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    title="Delete category"
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Create Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1A1615] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-xl text-white font-bold">Add New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Wing / Universe *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUniverse("BEAUTY_SKIN_HAIR")}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      universe === "BEAUTY_SKIN_HAIR"
                        ? "bg-[#E14D75]/20 border-[#E14D75] text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                    }`}
                  >
                    <Flower2 className="w-4 h-4 text-[#E14D75]" />
                    <span className="text-xs font-bold">🌸 Skincare & Hair</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUniverse("JEWELRY")}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      universe === "JEWELRY"
                        ? "bg-[#C2185B]/20 border-[#C2185B] text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                    }`}
                  >
                    <Gem className="w-4 h-4 text-[#C2185B]" />
                    <span className="text-xs font-bold">💎 Fine Jewellery</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Rose Toners, Bridal Maang Tikka..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe products belonging to this category..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C2185B] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-400 text-xs font-bold uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
