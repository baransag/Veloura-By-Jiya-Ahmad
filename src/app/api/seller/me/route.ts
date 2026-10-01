import { NextRequest, NextResponse } from "next/server";
import { getSellerSession } from "@/lib/auth";
import { findUserById, getStoreProducts } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Seller account not found" }, { status: 404 });
    }

    const products = await getStoreProducts({ sellerId: user.id });

    return NextResponse.json({
      seller: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        sellerShopName: user.sellerShopName || `${user.name}'s Atelier`,
        sellerBio: user.sellerBio || "",
        sellerWhatsApp: user.sellerWhatsApp || user.phone || "",
        sellerInstagram: user.sellerInstagram || "",
        sellerTikTok: user.sellerTikTok || "",
        sellerFacebook: user.sellerFacebook || "",
        sellerCity: user.sellerCity || "Lahore",
        adminProfitMargin: user.adminProfitMargin || 15,
        status: user.status,
        createdAt: user.createdAt,
      },
      productsCount: products.length,
      products,
    });
  } catch (error: any) {
    console.error("Seller ME error:", error);
    return NextResponse.json({ error: "Failed to fetch seller data" }, { status: 500 });
  }
}
