import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ── Option A: JSON body with { url: "https://..." } ──────────────────
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url } = body;
      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
      return NextResponse.json({ success: true, url });
    }

    // ── Option B: Multipart form — convert to base64 data URL ─────────────
    // Vercel has no persistent disk, so we store images as base64 in the DB.
    // For production scale, swap this for Cloudinary / Supabase Storage.
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Size guard: 4 MB max (Vercel payload limit is 4.5 MB)
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be under 4 MB" },
          { status: 413 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({ success: true, url: dataUrl });
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
