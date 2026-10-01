import { NextRequest, NextResponse } from "next/server";
import { getSellerSession } from "@/lib/auth";
import { findUserById, upsertStoreProduct, deleteStoreProduct, getStoreProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getStoreProducts({ sellerId: session.userId });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Seller products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await findUserById(session.userId);
    if (!seller) {
      return NextResponse.json({ error: "Seller account not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      universe, // "JEWELRY" | "BEAUTY_SKIN_HAIR"
      subCategory,
      sellerBasePrice,
      stock = 10,
      imageUrl,
      images,
      tags = [],
    } = body;

    if (!name || !sellerBasePrice) {
      return NextResponse.json(
        { error: "Product name and your base price are required" },
        { status: 400 }
      );
    }

    const basePriceNum = Number(sellerBasePrice);
    if (isNaN(basePriceNum) || basePriceNum <= 0) {
      return NextResponse.json({ error: "Invalid base price amount" }, { status: 400 });
    }

    // Admin sets the profit margin on the seller (default 15%)
    const adminMarginPct = seller.adminProfitMargin || 15;
    const adminProfit = Math.round(basePriceNum * (adminMarginPct / 100));
    const customerPrice = basePriceNum + adminProfit;

    const chosenUniverse = universe === "JEWELRY" ? "JEWELRY" : "BEAUTY_SKIN_HAIR";
    const chosenCat =
      chosenUniverse === "JEWELRY"
        ? { id: "cat-2", name: "Fine Jewelry & Pearls", slug: "fine-jewelry" }
        : { id: "cat-3", name: "Silk Skincare & Glow", slug: "silk-skincare" };

    const productImages =
      images && images.length > 0
        ? images
        : imageUrl
        ? [{ id: `img-${Date.now()}`, url: imageUrl, isPrimary: true }]
        : [{ id: `img-${Date.now()}`, url: "/uploads/products/item-01.jpeg", isPrimary: true }];

    const newProduct = await upsertStoreProduct({
      name: name.trim(),
      description: description || name,
      shortDescription: shortDescription || description?.slice(0, 110) || name,
      universe: chosenUniverse,
      subCategory: subCategory || (chosenUniverse === "JEWELRY" ? "Chokers & Necklaces" : "Facewash & Cleansers"),
      category: chosenCat,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerShopName: seller.sellerShopName || `${seller.name}'s Shop`,
      sellerBasePrice: basePriceNum,
      adminProfitMargin: adminMarginPct,
      price: customerPrice,
      stock: Number(stock) || 10,
      isPublished: true,
      images: productImages,
      tags: [...tags, chosenUniverse === "JEWELRY" ? "Fine Jewellery" : "Silk Beauty"],
    });

    return NextResponse.json({
      success: true,
      message: "Product listed successfully with automatic admin profit calculation!",
      product: newProduct,
      breakdown: {
        sellerBasePrice: basePriceNum,
        adminProfitMargin: `${adminMarginPct}%`,
        adminProfitAdded: adminProfit,
        customerListingPrice: customerPrice,
      },
    });
  } catch (error: any) {
    console.error("Seller products POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to add product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const success = await deleteStoreProduct(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("Seller product DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
