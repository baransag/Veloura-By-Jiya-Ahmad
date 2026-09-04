import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber.toUpperCase() },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
