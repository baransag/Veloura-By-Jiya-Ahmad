import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Auto-provision default testing accounts if they don't exist in a fresh database
    if (!user) {
      if ((cleanEmail === "admin@veloura.pk" || cleanEmail === "admin@veloura.com") && password === "admin123") {
        const passwordHash = await hashPassword("admin123");
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash,
            name: "Veloura Atelier Admin",
            role: "ADMIN",
          },
        });
      } else if (cleanEmail === "sarah@veloura.com" && password === "password123") {
        const passwordHash = await hashPassword("password123");
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash,
            name: "Sarah Khan",
            role: "CUSTOMER",
            phone: "+92 300 1234567",
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Role check isolation
    if (role === "ADMIN" && user.role !== "ADMIN") {
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

    // Set cookie based strictly on role
    if (user.role === "ADMIN") {
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
      { error: error?.message || "Failed to authenticate. Please check database connection." },
      { status: 500 }
    );
  }
}
