import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStoreProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Try PostgreSQL prisma first if available, otherwise seamlessly use store-data
    try {
      const where: any = { isPublished: true };
      if (category) where.category = { slug: category };
      if (featured === "true") where.isFeatured = true;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ];
      }

      let orderBy: any = { createdAt: "desc" };
      if (sort === "price-asc") orderBy = { price: "asc" };
      else if (sort === "price-desc") orderBy = { price: "desc" };

      const dbProducts = await prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({ products: dbProducts });
      }
    } catch (dbErr) {
      // Prisma error, fallback smoothly
    }

    // High performance store-data with WhatsApp catalog
    const products = await getStoreProducts({
      categorySlug: category,
      featured: featured === "true",
      search,
      sort,
      limit,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Store products API error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
