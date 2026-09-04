import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${cleanFileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/products/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
