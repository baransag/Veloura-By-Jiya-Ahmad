import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreProductBySlugOrId } from "@/lib/store-data";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch (err) {
    // Prisma error, check store-data fallback
  }

  if (!product) {
    product = await getStoreProductBySlugOrId(params.slug);
  }

  if (!product || !product.isPublished) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
