import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      province = "Punjab",
      postalCode,
      notes,
      paymentMethod,
      transactionReference,
      paymentScreenshot,
      items,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !city) {
      return NextResponse.json({ error: "Please fill in all required shipping fields." }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    }

    if (!["COD", "EASYPAISA", "JAZZCASH"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method selected." }, { status: 400 });
    }

    if ((paymentMethod === "EASYPAISA" || paymentMethod === "JAZZCASH") && !transactionReference?.trim()) {
      return NextResponse.json(
        { error: `Please enter your ${paymentMethod} transaction/reference ID.` },
        { status: 400 }
      );
    }

    // Check customer session if logged in
    const cookieStore = await cookies();
    const customerToken = cookieStore.get("veloura_customer_token")?.value;
    let userId: string | null = null;
    if (customerToken) {
      const payload = verifyToken(customerToken);
      if (payload && payload.role === "CUSTOMER") {
        userId = payload.userId;
      }
    }

    // Fetch site settings for shipping rule
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 3000;
    const baseShippingFee = settings?.shippingFee ?? 200;

    // Transactional order creation and inventory decrement
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate items & stock from REAL database records
      let calculatedSubtotal = 0;
      const orderItemsToCreate: any[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
        });

        if (!product) {
          throw new Error(`Product not found or unavailable.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`);
        }

        const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        const itemTotal = effectivePrice * item.quantity;
        calculatedSubtotal += itemTotal;

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          productImage: product.images[0]?.url || "/logo.png",
          price: effectivePrice,
          quantity: item.quantity,
          total: itemTotal,
        });

        // Decrement inventory
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const shippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : baseShippingFee;
      const total = calculatedSubtotal + shippingFee;

      // Unique human-readable Order Number: VEL-XXXXXX
      const orderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;

      // Payment Status determination
      let payStatus: PaymentStatus = PaymentStatus.PENDING;
      if (paymentMethod === "COD") {
        payStatus = PaymentStatus.PENDING; // or COD
      } else if (paymentMethod === "EASYPAISA" || paymentMethod === "JAZZCASH") {
        payStatus = PaymentStatus.PENDING_VERIFICATION;
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || undefined,
          customerName,
          customerEmail: customerEmail || `${customerPhone.replace(/[^0-9]/g, "")}@veloura.guest`,
          customerPhone,
          shippingAddress,
          city,
          province,
          postalCode: postalCode || null,
          notes: notes || null,
          subtotal: calculatedSubtotal,
          shippingFee,
          discount: 0,
          total,
          paymentMethod: paymentMethod as PaymentMethod,
          paymentStatus: payStatus,
          transactionReference: transactionReference?.trim() || null,
          paymentScreenshot: paymentScreenshot || null,
          orderStatus: OrderStatus.PENDING,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: result,
      message: "Order placed successfully.",
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to process order." }, { status: 400 });
  }
}
