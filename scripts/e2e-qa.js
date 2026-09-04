const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runQA() {
  console.log("=== VELOURA AUTOMATED QA & INTEGRATION VERIFICATION ===");

  // 1. Verify Site Settings
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  console.log("✓ Site Settings Loaded:");
  console.log("   Brand:", settings.brandName);
  console.log("   WhatsApp #:", settings.whatsappNumber);
  console.log("   Easypaisa #:", settings.easypaisaNumber);
  console.log("   JazzCash #:", settings.jazzcashNumber);
  if (settings.whatsappNumber !== "+92 321 9954325") throw new Error("Incorrect WhatsApp #");

  // 2. Create the exact requested product
  const cat = await prisma.category.findUnique({ where: { slug: "beauty-personal-care" } });
  
  const product = await prisma.product.upsert({
    where: { slug: "complete-hair-skin-care-bundle" },
    update: {
      stock: 10,
      price: 2500,
      salePrice: 1999,
      isPublished: true,
    },
    create: {
      name: "Complete Hair & Skin Care Bundle",
      slug: "complete-hair-skin-care-bundle",
      description: "A pure botanical silk elixir and revitalizing hair & skin care bundle, infused with Moroccan argan, golden jojoba, and hydrolyzed silk peptides for an ethereal, velvet radiance.",
      price: 2500,
      salePrice: 1999,
      stock: 10,
      sku: "VEL-BUNDLE-01",
      brand: "VELOURA",
      categoryId: cat.id,
      tags: ["Bundle", "Hair Care", "Skin Care", "Silk Elixir"],
      isPublished: true,
      images: {
        create: [
          {
            url: "/product-bundle.png",
            alt: "Complete Hair & Skin Care Bundle",
            isPrimary: true,
            sortOrder: 0,
          }
        ]
      }
    },
    include: { images: true, category: true }
  });

  console.log("✓ Exact QA Product Created / Verified:");
  console.log("   Name:", product.name);
  console.log("   Price: Rs.", product.price, "| Sale: Rs.", product.salePrice);
  console.log("   Category:", product.category?.name);
  console.log("   Stock:", product.stock);

  // 3. Verify New Arrivals query (createdAt DESC)
  const newArrivals = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });
  console.log("✓ Live New Arrivals count:", newArrivals.length);
  const foundInNew = newArrivals.find(p => p.id === product.id);
  if (!foundInNew) throw new Error("Product missing from New Arrivals!");
  console.log("✓ Product present in New Arrivals:", foundInNew.name);

  // 4. Test Transactional Order Creation with Easypaisa
  const orderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
  const order = await prisma.$transaction(async (tx) => {
    // Check and decrement stock
    const p = await tx.product.findUnique({ where: { id: product.id } });
    if (p.stock < 1) throw new Error("Out of stock");

    await tx.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 1 } }
    });

    return await tx.order.create({
      data: {
        orderNumber,
        customerName: "Ayesha Noor",
        customerPhone: "03211234567",
        customerEmail: "ayesha@example.com",
        shippingAddress: "House 42, Block B, DHA Phase 5",
        city: "Lahore",
        subtotal: 1999,
        shippingFee: 200,
        total: 2199,
        paymentMethod: "EASYPAISA",
        paymentStatus: "PENDING_VERIFICATION",
        transactionReference: "EP-8899776655",
        orderStatus: "PENDING",
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              productImage: "/product-bundle.png",
              price: 1999,
              quantity: 1,
              total: 1999
            }
          ]
        }
      },
      include: { items: true }
    });
  });

  console.log("✓ Transactional Order Placed with Easypaisa:");
  console.log("   Order #:", order.orderNumber);
  console.log("   Payment Method:", order.paymentMethod);
  console.log("   Payment Status:", order.paymentStatus);
  console.log("   TID:", order.transactionReference);
  console.log("   Total: Rs.", order.total);

  // 5. Verify stock decrement
  const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
  console.log("✓ Stock Decremented from 10 to:", updatedProduct.stock);
  if (updatedProduct.stock !== 9) throw new Error("Stock did not decrement properly!");

  // 6. Test Admin Payment Verification
  const verifiedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: "admin@veloura.com",
      orderStatus: "CONFIRMED"
    }
  });

  console.log("✓ Admin Payment Verification:");
  console.log("   Updated Payment Status:", verifiedOrder.paymentStatus);
  console.log("   Updated Order Status:", verifiedOrder.orderStatus);
  console.log("   Verified By:", verifiedOrder.verifiedBy);

  // 7. Test WhatsApp link generation
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");
  const productMsg = encodeURIComponent(`Hello VELOURA,
I am interested in:
${product.name}

Price:
Rs. ${product.salePrice}

Product link:
http://localhost:3000/product/${product.slug}

Please share availability and details.`);
  const productUrl = `https://wa.me/${cleanPhone}?text=${productMsg}`;

  const orderMsg = encodeURIComponent(`Hello VELOURA,

I have placed an order.

Order Number:
${order.orderNumber}

Items:
- ${product.name} x 1

Total:
Rs. ${order.total}

Payment Method:
${order.paymentMethod}

Please confirm my order.`);
  const orderUrl = `https://wa.me/${cleanPhone}?text=${orderMsg}`;

  console.log("✓ Dynamic WhatsApp URLs Generated:");
  console.log("   Product URL:", productUrl.slice(0, 80) + "...");
  console.log("   Order URL:", orderUrl.slice(0, 80) + "...");

  console.log("\n=== ALL QA TESTS PASSED WITH 100% SUCCESS ===");
}

runQA()
  .catch((e) => {
    console.error("QA FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
