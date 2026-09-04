import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });

    // Pending payments: Easypaisa / JazzCash pending manual verification
    const pendingPayments = await prisma.order.count({
      where: {
        paymentStatus: "PENDING_VERIFICATION",
      },
    });

    // Low stock products
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: { lte: 3 },
      },
    });

    // Revenue calculation
    const revenueAggregate = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        orderStatus: { not: "CANCELLED" },
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({
      revenue: revenueAggregate._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingPayments,
      lowStockCount: lowStockProducts,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
