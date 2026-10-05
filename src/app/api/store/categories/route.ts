import { NextRequest, NextResponse } from "next/server";
import { getStoreCategories } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universe = searchParams.get("universe") || undefined;
    const categories = await getStoreCategories(universe);

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Store categories GET error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
