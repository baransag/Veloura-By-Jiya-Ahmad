import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store-data";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials against admin override first
    const isAdminEmail = cleanEmail === "admin@veloura.pk" || cleanEmail === "admin@veloura.com";
    const isAdminPassword = password === "admin123" || password === "Veloura@Admin2026";

    if (isAdminEmail && isAdminPassword) {
      const token = signToken({
        userId: "usr-admin-1",
        email: cleanEmail,
        role: "ADMIN" as any,
        name: "Veloura Atelier Admin",
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: "usr-admin-1",
          email: cleanEmail,
          name: "Veloura Atelier Admin",
          role: "ADMIN",
        },
      });

      response.cookies.set("veloura_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      response.cookies.set("veloura_customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // Attempt Prisma database lookup
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      // Prisma error, will check store-data fallback below
    }

    // Fallback store lookup
    if (!user) {
      const storeUser = await findUserByEmail(cleanEmail);
      if (storeUser) {
        user = storeUser;
      }
    }

    // Demo customer auto-creation
    if (!user && cleanEmail === "sarah@veloura.com" && password === "password123") {
      user = {
        id: "usr-cust-1",
        email: cleanEmail,
        passwordHash: await hashPassword("password123"),
        name: "Sarah Khan",
        role: "CUSTOMER",
      };
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Role validation
    if (role === "ADMIN" && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized: Administrative privileges required" }, { status: 403 });
    }

    if (role === "CUSTOMER" && user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administrative accounts cannot log in through the customer shopping portal." },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    if (user.role === "ADMIN" || user.role === "STAFF") {
      response.cookies.set("veloura_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    } else {
      response.cookies.set("veloura_customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to authenticate. Please check connection." },
      { status: 500 }
    );
  }
}
