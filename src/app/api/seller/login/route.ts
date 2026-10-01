import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/store-data";
import { comparePassword, signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: "Account not registered. Please contact Atelier Admin to onboard your shop." },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only registered Sellers and Admins can access this portal." },
        { status: 403 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Your seller account has been paused by the Admin. Please contact support." },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password. Please check your credentials." }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.sellerShopName || user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerShopName: user.sellerShopName,
        adminProfitMargin: user.adminProfitMargin || 15,
      },
    });

    response.cookies.set("veloura_seller_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Seller login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
