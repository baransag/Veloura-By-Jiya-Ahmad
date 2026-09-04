"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, X, ArrowLeft, Check, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("VELOURA");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          const p = data.product;
          setName(p.name || "");
          setPrice(p.price?.toString() || "");
          setSalePrice(p.salePrice?.toString() || "");
          setCategoryName(p.category?.name || "Luxe Makeup & Lips");
          setStock(p.stock?.toString() || "10");
          setSku(p.sku || "");
          setBrand(p.brand || "VELOURA");
          setDescription(p.description || "");
          setTags(Array.isArray(p.tags) ? p.tags.join(", ") : "");
          setImages(p.images?.map((img: any) => img.url) || []);
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          salePrice: salePrice ? salePrice : null,
          stock,
          sku,
          brand,
          description,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setSuccessMsg("Product updated successfully! Visible across storefront.");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Error saving product changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs uppercase tracking-widest text-[#C5A880]">
        Loading Atelier Product Details...
      </div>
    );
  }

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
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
              Product Atelier CMS
            </span>
            <h1 className="font-serif text-2xl text-white">Edit Atelier Creation</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Images section */}
        <div className="bg-[#1A1615] p-6 rounded-xl border border-white/10 space-y-4">
          <label className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold block">
            Product Photography (Instant URLs or Disk Upload)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/40">
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-[#C5A880] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
              <Upload className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider">
                {uploading ? "Uploading..." : "Upload File"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct URL Add */}
          <div className="flex gap-2 pt-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste direct image URL (https://images.unsplash.com/...)"
              className="flex-1 px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg"
            >
              Add URL
            </button>
          </div>
        </div>

        {/* Pricing & Name */}
        <div className="bg-[#1A1615] p-6 rounded-xl border border-white/10 space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-zinc-400">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Regular Price (Rs.) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Sale Offer Price (Rs.)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Optional discount"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Inventory Units *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Brand Designation</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-zinc-400">Editorial Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-zinc-400">Search & Tag Keywords</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Jewelry, 18k Gold, Makeup, Bestseller"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-[#C5A880] hover:bg-[#D4B991] text-[#121012] font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 text-xs disabled:opacity-50"
        >
          {saving ? "Saving Changes to Atelier..." : "Save & Update Product"}
        </button>
      </form>
    </div>
  );
}
