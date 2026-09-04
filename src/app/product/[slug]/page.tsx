import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
