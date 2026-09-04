const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Default Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandName: "VELOURA",
      tagline: "Luxury Fashion & Beauty",
      whatsappNumber: "+92 321 9954325",
      supportPhone: "+92 321 9954325",
      easypaisaNumber: "+92 321 9954325",
      jazzcashNumber: "+92 321 9954325",
      currency: "PKR",
      currencySymbol: "Rs.",
      shippingFee: 200,
      freeShippingThreshold: 3000,
      announcement: "Complimentary Silk Packaging & Free Delivery on orders over Rs. 3,000",
    },
  });

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@veloura.com" },
    update: {},
    create: {
      email: "admin@veloura.com",
      passwordHash: adminPassword,
      name: "Veloura Admin",
      role: "ADMIN",
    },
  });

  // Default Categories
  const categories = [
    { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Elixirs, silk serums & luxury botanicals" },
    { name: "Silk Pret", slug: "silk-pret", description: "Pure mulberry silk, tailored cuts & bespoke silhouettes" },
    { name: "Luxury Velvet", slug: "luxury-velvet", description: "Deep wine & burgundy velvet ensembles" },
    { name: "Fragrances", slug: "fragrances", description: "Sensual amber, oud & floral haute perfumery" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
