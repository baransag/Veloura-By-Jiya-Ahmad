import { NextRequest, NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universe = searchParams.get("universe") || undefined;
    const subCategory = searchParams.get("subCategory") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";
    const deals = searchParams.get("deals") === "true" || universe === "DEALS";
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const products = await getStoreProducts({
      universe,
      subCategory,
      categorySlug: category,
      featured,
      deals,
      search,
      sort,
      limit,
    });

    return NextResponse.json({ products: products || [], total: products?.length || 0 });
  } catch (error: any) {
    console.error("Store products API error:", error);
    return NextResponse.json({ products: [], total: 0, error: error.message }, { status: 200 });
  }
}

