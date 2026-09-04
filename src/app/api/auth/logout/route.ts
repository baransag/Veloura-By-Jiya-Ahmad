import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { role } = await req.json().catch(() => ({}));
  const response = NextResponse.json({ success: true, message: "Logged out" });
  if (role === "ADMIN") {
    response.cookies.delete("veloura_admin_token");
  } else {
    response.cookies.delete("veloura_customer_token");
  }
  return response;
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const customerToken = cookieStore.get("veloura_customer_token")?.value;
  const adminToken = cookieStore.get("veloura_admin_token")?.value;

  if (adminToken) {
    const admin = verifyToken(adminToken);
    if (admin && admin.role === "ADMIN") {
      return NextResponse.json({ user: admin });
    }
  }

  if (customerToken) {
    const customer = verifyToken(customerToken);
    if (customer) {
      const dbUser = await prisma.user.findUnique({
        where: { id: customer.userId },
        select: { id: true, email: true, name: true, phone: true, role: true },
      });
      return NextResponse.json({ user: dbUser });
    }
  }

  return NextResponse.json({ user: null });
}
