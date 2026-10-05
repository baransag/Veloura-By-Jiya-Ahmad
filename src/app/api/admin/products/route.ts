import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getStoreProducts, upsertStoreProduct, getStoreCategories, addStoreCategory } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universe = searchParams.get("universe") || undefined;
    const deals = searchParams.get("deals") === "true";

    // 1. Try Prisma DB
    try {
      const where: any = {};
      if (deals) where.salePrice = { not: null };

      const products = await prisma.product.findMany({
        where,
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
      // Fallback smoothly
    }

    // 2. High-performance fallback
    const fallbackProducts = await getStoreProducts({
      universe,
      deals,
    });
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
      universe = "BEAUTY_SKIN_HAIR",
      subCategory,
      categoryId,
      categoryName,
      stock = 10,
      sku,
      brand,
      description,
      shortDescription,
      isDeal = false,
      dealBadge,
      tags = [],
      images = [],
      isPublished = true,
      isFeatured = false,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const finalUniverse = universe === "JEWELRY" ? "JEWELRY" : "BEAUTY_SKIN_HAIR";
    const parsedPrice = parseFloat(price);
    const parsedSalePrice = salePrice ? parseFloat(salePrice) : null;
    const isDealActive = Boolean(isDeal || (parsedSalePrice && parsedSalePrice < parsedPrice));
    const effectiveDealBadge = dealBadge || (isDealActive ? "SPECIAL DEAL" : undefined);

    let catObj = {
      id: categoryId || "cat-default",
      name: categoryName || (finalUniverse === "JEWELRY" ? "Fine Jewelry & Pearls" : "Silk Skincare & Serums"),
      slug: (categoryName || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    // Ensure category exists in store-data
    if (categoryName) {
      const createdCat = await addStoreCategory({
        name: categoryName,
        universe: finalUniverse,
      });
      catObj = {
        id: createdCat.id,
        name: createdCat.name,
        slug: createdCat.slug,
      };
    }

    const formattedImages = Array.isArray(images) && images.length > 0
      ? images.map((img: any, idx: number) => ({
          id: `img-${Date.now()}-${idx}`,
          url: typeof img === "string" ? img : img.url,
          alt: name,
          isPrimary: idx === 0,
          sortOrder: idx,
        }))
      : [];

    // 1. Always save into Store-Data (Immediate guarantee for storefront)
    const storeProduct = await upsertStoreProduct({
      name,
      price: parsedPrice,
      salePrice: parsedSalePrice,
      isDeal: isDealActive,
      dealBadge: effectiveDealBadge,
      universe: finalUniverse,
      subCategory: subCategory || (finalUniverse === "JEWELRY" ? "Chokers & Necklaces" : "Facewash & Cleansers"),
      category: catObj,
      stock: parseInt(stock) || 10,
      sku: (sku && typeof sku === "string" && sku.trim()) || `VEL-${Date.now().toString().slice(-6)}`,
      brand: brand || "VELOURA Haute Atelier",
      description: description || name,
      shortDescription: shortDescription || description?.slice(0, 110) || name,
      tags: Array.isArray(tags) ? tags : [],
      images: formattedImages,
      isPublished: Boolean(isPublished),
      isFeatured: Boolean(isFeatured),
    });

    // 2. Also try writing to Prisma PostgreSQL if available
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
      if (!finalCategoryId && catObj.name) {
        const cat = await prisma.category.upsert({
          where: { slug: catObj.slug },
          update: {},
          create: { name: catObj.name, slug: catObj.slug },
        });
        finalCategoryId = cat.id;
      }

      await prisma.product.create({
        data: {
          name,
          slug,
          description: description || name,
          shortDescription: shortDescription || null,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          stock: parseInt(stock) || 10,
          sku: storeProduct.sku,
          brand: brand || "VELOURA",
          tags: Array.isArray(tags) ? tags : [],
          categoryId: finalCategoryId || null,
          isPublished: Boolean(isPublished),
          isFeatured: Boolean(isFeatured),
          images: {
            create: formattedImages.map((img: any) => ({
              url: img.url,
              alt: name,
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder,
            })),
          },
        },
      });
    } catch (prismaErr) {
      console.warn("Prisma error in create (store-data saved):", prismaErr);
    }

    return NextResponse.json({
      success: true,
      product: storeProduct,
      message: `Product "${name}" published successfully! Live across the store.`,
    });
  } catch (error: any) {
    console.error("Admin product POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
