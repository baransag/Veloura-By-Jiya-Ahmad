import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const customerToken = cookieStore.get("veloura_customer_token")?.value;

  if (customerToken) {
    const customer = verifyToken(customerToken);
    if (customer && customer.role === "CUSTOMER") {
      const dbUser = await prisma.user.findUnique({
        where: { id: customer.userId },
        select: { id: true, email: true, name: true, phone: true, role: true },
      });
      return NextResponse.json({ user: dbUser });
    }
  }

  return NextResponse.json({ user: null });
}
