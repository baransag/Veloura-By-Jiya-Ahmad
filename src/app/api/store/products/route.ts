import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

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
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Store products API error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
