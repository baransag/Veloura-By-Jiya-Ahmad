import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStoreProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universe = searchParams.get("universe");
    const subCategory = searchParams.get("subCategory");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // If PostgreSQL Prisma has the full catalog (>100 items), use it; otherwise seamlessly serve the full 199 products
    try {
      const pCount = await prisma.product.count({ where: { isPublished: true } });
      if (pCount >= 100) {
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

        if (dbProducts && dbProducts.length >= 100) {
          return NextResponse.json({ products: dbProducts });
        }
      }
    } catch (dbErr) {
      // Prisma fallback smoothly
    }

    // High performance store-data with full 199 WhatsApp & Atelier creations
    const products = await getStoreProducts({
      universe,
      subCategory,
      categorySlug: category,
      featured: featured === "true",
      search,
      sort,
      limit,
    });

    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    console.error("Store products API error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
