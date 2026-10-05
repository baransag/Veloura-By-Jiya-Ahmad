"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  Gem,
  Flower2,
  Flame,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState("");
  const [universe, setUniverse] = useState<"JEWELRY" | "BEAUTY_SKIN_HAIR">("BEAUTY_SKIN_HAIR");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  // Pricing & Deals
  const [price, setPrice] = useState("");
  const [isDeal, setIsDeal] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [dealBadge, setDealBadge] = useState("SPECIAL DEAL");

  // Inventory & Story
  const [stock, setStock] = useState("15");
  const [sku, setSku] = useState(`VEL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [brand, setBrand] = useState("VELOURA Haute Atelier");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // Photos
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/categories?universe=${universe}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setSelectedCategory(data.categories[0].name);
        }
      })
      .catch(() => {});
  }, [universe]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), universe }),
      });
      const data = await res.json();
      if (res.ok && data.category) {
        setCategories((prev) => [...prev, data.category]);
        setSelectedCategory(data.category.name);
        setNewCatName("");
        setShowAddCat(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          universe,
          categoryName: selectedCategory,
          price,
          salePrice: isDeal && salePrice ? salePrice : null,
          isDeal,
          dealBadge: isDeal ? dealBadge : undefined,
          stock,
          sku,
          brand,
          description,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          images,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish product");
      }

      setSuccessMsg(`✓ Product "${name}" published! Live on storefront instantly.`);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Error creating product");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
              Product Atelier CMS
            </span>
            <h1 className="font-serif text-2xl text-white">Create & Publish Product</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-6">
        {/* 1. Wing / Universe Selector */}
        <div className="bg-[#1A1615] p-6 rounded-2xl border border-white/10 space-y-3">
          <label className="text-xs uppercase tracking-wider text-zinc-400 font-bold block">
            1. Select Wing / Universe *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUniverse("BEAUTY_SKIN_HAIR")}
              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                universe === "BEAUTY_SKIN_HAIR"
                  ? "bg-[#E14D75]/20 border-[#E14D75] text-white shadow-sm"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
            >
              <Flower2 className="w-6 h-6 text-[#E14D75]" />
              <div>
                <div className="text-xs font-bold text-white">🌸 Silk Skincare & Hair Wing</div>
                <div className="text-[10px] text-zinc-400">Facewashes, Serums, Argan Oils, Lip Care</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUniverse("JEWELRY")}
              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                universe === "JEWELRY"
                  ? "bg-[#C2185B]/20 border-[#C2185B] text-white shadow-sm"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
            >
              <Gem className="w-6 h-6 text-[#C2185B]" />
              <div>
                <div className="text-xs font-bold text-white">💎 Fine Jewellery Wing</div>
                <div className="text-[10px] text-zinc-400">Chokers, Kundan Sets, Rings, Jhumkas</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Photo Upload Card */}
        <div className="bg-[#1A1615] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-2">
              <span>2. Product Photography</span>
              <span className="text-[10px] text-zinc-500 font-normal">(PNG, JPG, WebP)</span>
            </label>
            {uploading && <span className="text-[11px] text-[#C2185B] animate-pulse">Uploading photo...</span>}
          </div>

          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-32 rounded-xl overflow-hidden border border-white/20 group shadow-md">
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#C2185B] text-white text-[8px] font-bold uppercase">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className="w-24 h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-[#C2185B] flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center bg-black/20">
              <Upload className="w-5 h-5 text-zinc-400 mb-1" />
              <span className="text-[10px] text-zinc-400">
                {uploading ? "Uploading..." : "Add Photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* 3. Product Details */}
        <div className="p-6 rounded-2xl bg-[#1A1615] border border-white/10 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Damask Rose Foaming Facewash or 18K Kundan Choker"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
            />
          </div>

          {/* Category Dropdown & Quick Add */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Category *</label>
              <button
                type="button"
                onClick={() => setShowAddCat(!showAddCat)}
                className="text-[11px] text-[#C2185B] hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>+ Create New Category</span>
              </button>
            </div>

            {showAddCat ? (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Enter new category name..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  className="px-3 py-1.5 rounded-lg bg-[#C2185B] text-white text-xs font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCat(false)}
                  className="px-2 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#1A1615]">
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pricing & Deals Engine */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF4D8D]" />
                <span>Special Deal / Flash Drop Offer?</span>
              </label>
              <input
                type="checkbox"
                checked={isDeal}
                onChange={(e) => setIsDeal(e.target.checked)}
                className="w-4 h-4 accent-[#C2185B] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase tracking-wider text-[10px]">
                  Regular Store Price (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              {isDeal && (
                <div className="space-y-1">
                  <label className="text-[#FF4D8D] uppercase tracking-wider text-[10px] font-bold">
                    Special Deal / Discounted Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required={isDeal}
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4D8D] text-white focus:outline-none focus:border-[#FF4D8D]"
                  />
                </div>
              )}
            </div>

            {isDeal && (
              <div className="space-y-1 pt-1">
                <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Deal Badge Label</label>
                <input
                  type="text"
                  value={dealBadge}
                  onChange={(e) => setDealBadge(e.target.value)}
                  placeholder="e.g. DEAL 650/-, FLASH DROP, BUY 1 GET 1"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Stock Inventory *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Description & Formulation Story</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials (18K gold vermeil, organic Damask rose, peptides)..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Facewash, Organic, Glow, Rosewater"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={publishing || uploading}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#E14D75] hover:brightness-110 text-white font-bold uppercase tracking-[0.25em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {publishing ? (
              "Publishing to Storefront..."
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F4B8C6]" />
                <span>Publish Creation to Store (Instant Live)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
