import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
