import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name,
      price,
      salePrice,
      categoryId,
      stock,
      sku,
      brand,
      description,
      shortDescription,
      tags,
      images,
      isPublished,
      isFeatured,
    } = body;

    // Delete existing images if new image array is provided
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price: price !== undefined ? parseFloat(price) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        sku,
        brand,
        description,
        shortDescription,
        tags: Array.isArray(tags) ? tags : undefined,
        categoryId: categoryId || undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        images: Array.isArray(images)
          ? {
              create: images.map((img: any, idx: number) => ({
                url: typeof img === "string" ? img : img.url,
                alt: name || "Product Image",
                isPrimary: idx === 0,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
