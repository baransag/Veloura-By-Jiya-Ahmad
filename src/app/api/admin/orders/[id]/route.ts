import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
      if (paymentStatus === "VERIFIED") {
        data.verifiedAt = new Date();
        data.verifiedBy = admin.email;
      }
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
