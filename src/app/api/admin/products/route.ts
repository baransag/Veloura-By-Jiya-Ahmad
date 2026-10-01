import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getStoreProducts, upsertStoreProduct } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
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
      if (products && products.length > 0) {
        return NextResponse.json({ products });
      }
    } catch (dbErr) {
      // Fallback
    }

    const fallbackProducts = await getStoreProducts();
    return NextResponse.json({ products: fallbackProducts });
  } catch (error: any) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
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

    // Try Prisma first
    try {
      let baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (!baseSlug) baseSlug = `prod-${Date.now()}`;

      let slug = baseSlug;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

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

      let baseSku = (sku && typeof sku === "string" && sku.trim()) || `VEL-${Date.now().toString().slice(-6)}`;
      let finalSku = baseSku;
      let skuCounter = 1;
      while (await prisma.product.findUnique({ where: { sku: finalSku } })) {
        finalSku = `${baseSku}-${skuCounter}`;
        skuCounter++;
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
          sku: finalSku,
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
    } catch (prismaErr) {
      console.warn("Prisma error in create, saving to store-data fallback:", prismaErr);
    }

    // Fallback store
    const newProduct = await upsertStoreProduct({
      name,
      description: description || name,
      shortDescription: shortDescription || "",
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      stock: parseInt(stock) || 10,
      sku: sku || `VEL-${Date.now().toString().slice(-6)}`,
      brand: brand || "VELOURA Haute Atelier",
      tags: Array.isArray(tags) ? tags : [],
      isPublished: Boolean(isPublished),
      isFeatured: Boolean(isFeatured),
      category: {
        id: "cat-1",
        name: categoryName || "Luxe Makeup & Lips",
        slug: (categoryName || "luxe-makeup").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
      images: Array.isArray(images)
        ? images.map((img: any, idx: number) => ({
            id: `img-${Date.now()}-${idx}`,
            url: typeof img === "string" ? img : img.url,
            alt: name,
            isPrimary: idx === 0,
            sortOrder: idx,
          }))
        : [{ id: `img-1`, url: "/uploads/products/item-01.jpeg", isPrimary: true }],
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Product published successfully.",
    });
  } catch (error: any) {
    console.error("Admin product POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
