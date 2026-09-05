"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Check, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("Complete Hair & Skin Care Bundle");
  const [price, setPrice] = useState("2500");
  const [salePrice, setSalePrice] = useState("1999");
  const [categoryName, setCategoryName] = useState("Beauty & Personal Care");
  const [stock, setStock] = useState("10");
  const [sku, setSku] = useState("VEL-BUNDLE-01");
  const [brand, setBrand] = useState("VELOURA");
  const [description, setDescription] = useState(
    "A pure botanical silk elixir and revitalizing hair & skin care bundle, infused with Moroccan argan, golden jojoba, and hydrolyzed silk peptides for an ethereal, velvet radiance."
  );
  const [tags, setTags] = useState("Bundle, Beauty, Hair Care, Skin Care, Organic");

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
          price,
          salePrice: salePrice ? salePrice : null,
          categoryName,
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

      setSuccessMsg("Product published successfully. Live in Storefront New Arrivals!");
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
        <div className="p-4 rounded-lg bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {error.toLowerCase().includes("unauthorized") && (
            <Link
              href="/admin/login"
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold tracking-wider uppercase underline underline-offset-4"
            >
              Sign In To Admin
            </Link>
          )}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Gallery Upload Card */}
        <div className="bg-[#1A1615] p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-2">
              <span>Product Photography</span>
              <span className="text-[10px] text-zinc-500 font-normal">(PNG, JPG, WebP)</span>
            </label>
            {uploading && <span className="text-[11px] text-[#C2185B] animate-pulse">Uploading to Atelier...</span>}
          </div>

          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-32 rounded-lg overflow-hidden border border-white/20 group">
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className="w-24 h-32 rounded-lg border-2 border-dashed border-white/20 hover:border-[#C2185B] flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center bg-black/20">
              <Upload className="w-5 h-5 text-zinc-400 mb-1" />
              <span className="text-[10px] text-zinc-400">
                {uploading ? "Uploading..." : "Add Image"}
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

        {/* Details Card */}
        <div className="p-6 rounded-xl bg-[#1A1615] border border-white/10 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Regular Price (Rs.) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Sale / Offer Price (Rs.)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Category *</label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Stock Quantity *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider text-[10px]">SKU Identifier</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Description & Story</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C2185B]"
            />
          </div>
        </div>

        {/* ONE-CLICK PUBLISH BUTTON - MANDATORY SPEC */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={publishing}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white font-bold uppercase tracking-[0.25em] text-xs rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {publishing ? (
              "Writing to PostgreSQL & Publishing..."
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F4B8C6]" />
                Publish Product (One Click)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
