import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      price,
      salePrice,
      categoryId,
      categoryName,
      stock,
      sku,
      brand,
      description,
      shortDescription,
      tags,
      images,
      isPublished = true,
      isFeatured = false,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Auto-generate or sanitize slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!baseSlug) baseSlug = `prod-${Date.now()}`;

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // If categoryName was passed but not categoryId, find or create category
    let finalCategoryId = categoryId;
    if (!finalCategoryId && categoryName) {
      const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const cat = await prisma.category.upsert({
        where: { slug: catSlug },
        update: {},
        create: { name: categoryName, slug: catSlug },
      });
      finalCategoryId = cat.id;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || name,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock) || 0,
        sku: sku || `SKU-${Date.now()}`,
        brand: brand || "VELOURA",
        tags: Array.isArray(tags) ? tags : [],
        categoryId: finalCategoryId || null,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        images: {
          create: Array.isArray(images)
            ? images.map((img: any, idx: number) => ({
                url: typeof img === "string" ? img : img.url,
                alt: name,
                isPrimary: idx === 0,
                sortOrder: idx,
              }))
            : [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: "Product published successfully.",
    });
  } catch (error: any) {
    console.error("Admin product POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
