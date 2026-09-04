const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding luxury beauty & jewelry atelier...");

  // Default Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      tagline: "Atelier of Silk Beauty & Fine Jewels",
      announcement: "✨ Complimentary Velvet Box Packaging & Free Delivery Across Pakistan on Orders Over Rs. 3,000",
    },
    create: {
      id: "default",
      brandName: "VELOURA",
      tagline: "Atelier of Silk Beauty & Fine Jewels",
      whatsappNumber: "+92 321 9954325",
      supportPhone: "+92 321 9954325",
      easypaisaNumber: "+92 321 9954325",
      jazzcashNumber: "+92 321 9954325",
      currency: "PKR",
      currencySymbol: "Rs.",
      shippingFee: 200,
      freeShippingThreshold: 3000,
      announcement: "✨ Complimentary Velvet Box Packaging & Free Delivery Across Pakistan on Orders Over Rs. 3,000",
    },
  });

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@veloura.com" },
    update: { passwordHash: adminPassword },
    create: {
      email: "admin@veloura.com",
      passwordHash: adminPassword,
      name: "Veloura Atelier Admin",
      role: "ADMIN",
    },
  });

  // Demo Customer
  const customerPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "sarah@veloura.com" },
    update: { passwordHash: customerPassword },
    create: {
      email: "sarah@veloura.com",
      passwordHash: customerPassword,
      name: "Sarah Khan",
      role: "CUSTOMER",
      phone: "+92 300 1234567",
    },
  });

  // 4 Luxury Beauty & Jewelry Categories
  const categories = [
    {
      name: "Luxe Makeup & Lips",
      slug: "luxe-makeup",
      description: "Velvet matte liquid silks, gold-infused lip oils & ethereal tints",
    },
    {
      name: "Fine Jewelry & Pearls",
      slug: "fine-jewelry",
      description: "18K gold-plated chokers, freshwater baroque pearls & zircon tennis bracelets",
    },
    {
      name: "Silk Skincare & Glow",
      slug: "silk-skincare",
      description: "Hydrolyzed silk peptides, rose gold facial elixirs & botanical mists",
    },
    {
      name: "Hair Elixirs & Fragrance",
      slug: "hair-fragrance",
      description: "Pure Moroccan argan silk serums, amber velvet hair mists & perfumes",
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }

  // Real Curated Makeup & Jewelry Products
  const products = [
    {
      name: "Velvet Silk Liquid Lip Elixir — Rose Truffle",
      slug: "velvet-silk-liquid-lip-elixir-rose-truffle",
      description: "A weightless velvet lip mousse enriched with pure silk amino acids and organic rosehip oil. Delivers a feather-soft matte finish without drying, lasting up to 12 hours with a soft-focus blur effect.",
      price: 2450,
      salePrice: 1950,
      sku: "VEL-LIP-01",
      categorySlug: "luxe-makeup",
      stock: 45,
      isFeatured: true,
      tags: ["Lipstick", "Makeup", "Velvet", "Best Seller"],
      images: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "18K Gold Baroque Freshwater Pearl Droplet Choker",
      slug: "18k-gold-baroque-freshwater-pearl-choker",
      description: "Handcrafted 18-karat gold-plated delicate chain adorned with iridescent organic freshwater baroque pearls. Tarnish-resistant, hypoallergenic, and designed for ethereal bridal and soiree elegance.",
      price: 4800,
      salePrice: 3850,
      sku: "VEL-JWL-01",
      categorySlug: "fine-jewelry",
      stock: 20,
      isFeatured: true,
      tags: ["Jewelry", "Pearls", "18k Gold", "Choker", "Trending"],
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Celestial Zirconia Sparkle Tennis Bracelet",
      slug: "celestial-zirconia-sparkle-tennis-bracelet",
      description: "Brilliant 3mm AAAAA round-cut cubic zirconia gemstones set in platinum-bonded 18K gold clasp. Shimmers with mesmerizing fire and diamond clarity under every light.",
      price: 3950,
      salePrice: 3200,
      sku: "VEL-JWL-02",
      categorySlug: "fine-jewelry",
      stock: 30,
      isFeatured: true,
      tags: ["Jewelry", "Bracelet", "Zirconia", "Gifts for Her"],
      images: [
        "https://images.unsplash.com/photo-1611591475152-473549646b9a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Pure Botanical Silk Peptide Glow Serum",
      slug: "pure-botanical-silk-peptide-glow-serum",
      description: "An intensive radiance concentrate with bio-fermented silk peptides, 24K gold nano-flakes, and hyaluronic acid. Imparts an instant glass-skin dewy luminescence and deeply plumps skin.",
      price: 3600,
      salePrice: 2850,
      sku: "VEL-SKN-01",
      categorySlug: "silk-skincare",
      stock: 35,
      isFeatured: true,
      tags: ["Skincare", "Silk", "Serum", "Glow", "24K Gold"],
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608248597359-24755106fb6b?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "24K Golden Shimmer Silk Lip Gloss & Plumper",
      slug: "24k-golden-shimmer-silk-lip-gloss",
      description: "High-shine glass finish infused with delicate champagne shimmer and peppermint peptide plumping complex. Nourishes lips with jojoba and shea for all-day supple volume.",
      price: 1850,
      salePrice: 1490,
      sku: "VEL-LIP-02",
      categorySlug: "luxe-makeup",
      stock: 50,
      isFeatured: true,
      tags: ["Lip Gloss", "Makeup", "Plumper", "Gold"],
      images: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Starlight Crystal Huggie Hoops & Ear Climbers",
      slug: "starlight-crystal-huggie-hoops",
      description: "Dainty 18K gold-plated huggie earrings set with pavé micro-crystals. Ultra-lightweight and comfortable for 24/7 wear, adding an effortless touch of girl luxury to every outfit.",
      price: 2600,
      salePrice: 2100,
      sku: "VEL-JWL-03",
      categorySlug: "fine-jewelry",
      stock: 40,
      isFeatured: false,
      tags: ["Jewelry", "Earrings", "Gold Plated", "Minimalist"],
      images: [
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Moroccan Argan & Liquid Silk Hair Nectar",
      slug: "moroccan-argan-liquid-silk-hair-nectar",
      description: "Weightless botanical hair treatment infused with cold-pressed Moroccan argan oil, silk protein, and damask rose extract. Tames flyaways and provides glossy, mirror-like silk shine.",
      price: 2900,
      salePrice: 2400,
      sku: "VEL-HAIR-01",
      categorySlug: "hair-fragrance",
      stock: 28,
      isFeatured: true,
      tags: ["Haircare", "Argan Oil", "Silk Shine", "Serum"],
      images: [
        "https://images.unsplash.com/photo-1608248597289-5405629c4266?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Rose Damascena Velvet Mist & Silk Toner",
      slug: "rose-damascena-velvet-mist-silk-toner",
      description: "100% steam-distilled organic rose water infused with glycerin and botanical aloe vera. Instantly refreshes makeup, hydrates skin, and soothes redness with an enchanting fresh floral scent.",
      price: 1990,
      salePrice: 1650,
      sku: "VEL-SKN-02",
      categorySlug: "silk-skincare",
      stock: 60,
      isFeatured: false,
      tags: ["Skincare", "Rose Mist", "Toner", "Organic"],
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
      ],
    },
  ];

  for (const p of products) {
    const { categorySlug, images, ...pData } = p;
    const catId = catMap[categorySlug];

    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...pData,
        categoryId: catId,
      },
      create: {
        ...pData,
        categoryId: catId,
      },
    });

    // Seed product images
    await prisma.productImage.deleteMany({ where: { productId: prod.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: prod.id,
          url: images[i],
          isPrimary: i === 0,
          sortOrder: i,
        },
      });
    }
  }

  console.log("Database seeded successfully with 8 luxury beauty & jewelry products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
