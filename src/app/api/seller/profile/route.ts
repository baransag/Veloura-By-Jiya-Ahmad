import { NextRequest, NextResponse } from "next/server";
import { getSellerSession } from "@/lib/auth";
import { updateSellerProfile } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSellerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      sellerShopName,
      sellerBio,
      sellerWhatsApp,
      sellerInstagram,
      sellerTikTok,
      sellerFacebook,
      sellerCity,
      name,
    } = body;

    const updated = await updateSellerProfile(session.userId, {
      ...(sellerShopName && { sellerShopName: sellerShopName.trim() }),
      ...(sellerBio !== undefined && { sellerBio: sellerBio.trim() }),
      ...(sellerWhatsApp !== undefined && { sellerWhatsApp: sellerWhatsApp.trim() }),
      ...(sellerInstagram !== undefined && { sellerInstagram: sellerInstagram.trim() }),
      ...(sellerTikTok !== undefined && { sellerTikTok: sellerTikTok.trim() }),
      ...(sellerFacebook !== undefined && { sellerFacebook: sellerFacebook.trim() }),
      ...(sellerCity !== undefined && { sellerCity: sellerCity.trim() }),
      ...(name && { name: name.trim() }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Shop profile and social links updated successfully!",
      seller: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        sellerShopName: updated.sellerShopName,
        sellerBio: updated.sellerBio,
        sellerWhatsApp: updated.sellerWhatsApp,
        sellerInstagram: updated.sellerInstagram,
        sellerTikTok: updated.sellerTikTok,
        sellerFacebook: updated.sellerFacebook,
        sellerCity: updated.sellerCity,
        adminProfitMargin: updated.adminProfitMargin,
      },
    });
  } catch (error: any) {
    console.error("Seller profile PATCH error:", error);
    return NextResponse.json({ error: "Failed to update shop details" }, { status: 500 });
  }
}
