import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "SELLER" | "CUSTOMER";
  passwordHash: string;
  sellerShopName?: string;
  sellerCommission?: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: string;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }>;
  sellerId?: string;
  sellerName?: string;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), "data", "store-db.json");

// Default initial users
const defaultUsers: StoreUser[] = [
  {
    id: "usr-admin-1",
    name: "Veloura Atelier Admin",
    email: "admin@veloura.pk",
    phone: "+92 321 9954325",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 10),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-admin-2",
    name: "Jiya Ahmad (Founder)",
    email: "admin@veloura.com",
    phone: "+92 321 9954325",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 10),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-staff-1",
    name: "Zainab Raza (Order Dispatch Manager)",
    email: "zainab.staff@veloura.pk",
    phone: "+92 301 4455667",
    role: "STAFF",
    passwordHash: bcrypt.hashSync("staff123", 10),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-seller-1",
    name: "Lahore Jewels & Pearls (Daraz Seller)",
    email: "vendor.jewels@veloura.pk",
    phone: "+92 300 8899112",
    role: "SELLER",
    passwordHash: bcrypt.hashSync("seller123", 10),
    sellerShopName: "Lahore Heritage Pearls & Jewels",
    sellerCommission: 12,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-cust-1",
    name: "Sarah Khan",
    email: "sarah@veloura.com",
    phone: "+92 300 1234567",
    role: "CUSTOMER",
    passwordHash: bcrypt.hashSync("password123", 10),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];

// Helper to generate initial 22 products with WhatsApp extracted images
function generateDefaultProducts(): StoreProduct[] {
  const categories = {
    makeup: { id: "cat-1", name: "Luxe Makeup & Lips", slug: "luxe-makeup" },
    jewelry: { id: "cat-2", name: "Fine Jewelry & Pearls", slug: "fine-jewelry" },
    skincare: { id: "cat-3", name: "Silk Skincare & Glow", slug: "silk-skincare" },
    hair: { id: "cat-4", name: "Hair Elixirs & Fragrance", slug: "hair-fragrance" },
  };

  const rawList = [
    {
      id: "prod-01",
      name: "Veloura Velvet Matte Lip Casket — 6 Luxe Shades",
      slug: "veloura-velvet-matte-lip-casket-6-luxe-shades",
      cat: categories.makeup,
      price: 3850,
      salePrice: 2990,
      sku: "VEL-LIP-SET-01",
      stock: 40,
      isFeatured: true,
      tags: ["Lipstick", "Matte", "Best Seller", "Velvet Silk", "Trending"],
      shortDescription: "An opulent boxed casket of 6 feather-light velvet matte liquid lip silks in royal ruby, berry, and nude rose hues.",
      description: "An opulent collection of 6 feather-weight velvet matte liquid silks in iconic ruby, berry, and nude rose hues. Enriched with botanical jojoba oil and pure vitamin E for 16-hour comfort without feathering or drying. Comes in a signature crimson presentation casket.",
      images: ["/uploads/products/item-01.jpeg", "/uploads/products/item-02.jpeg", "/uploads/products/item-03.jpeg", "/uploads/products/item-04.jpeg"],
    },
    {
      id: "prod-02",
      name: "24K Gold Starlight Pavé Zircon Choker & Earrings Set",
      slug: "24k-gold-starlight-pave-zircon-choker-earrings-set",
      cat: categories.jewelry,
      price: 6500,
      salePrice: 5200,
      sku: "VEL-JWL-SET-01",
      stock: 18,
      isFeatured: true,
      tags: ["Jewelry", "Choker", "18K Gold", "Bridal", "Zircon"],
      shortDescription: "Handcrafted 18K gold-plated bridal soiree choker encrusted with high-fire pavé cubic zircon stones and matching drop earrings.",
      description: "Handcrafted 18K gold-plated bridal soiree choker encrusted with high-fire pavé cubic zircon stones and matching drop earrings. Tarnish-free, hypoallergenic, and crafted for royal brides and evening galas.",
      images: ["/uploads/products/item-05.jpeg", "/uploads/products/item-06.jpeg", "/uploads/products/item-07.jpeg", "/uploads/products/item-08.jpeg"],
    },
    {
      id: "prod-03",
      name: "Haute Shimmer Rose Gold Highlighter & Blush Glow Palette",
      slug: "haute-shimmer-rose-gold-highlighter-blush-palette",
      cat: categories.makeup,
      price: 2950,
      salePrice: 2350,
      sku: "VEL-GLW-01",
      stock: 35,
      isFeatured: true,
      tags: ["Highlighter", "Blush", "Rose Gold", "Glow"],
      shortDescription: "Micro-milled baked rose pearl pigments that melt effortlessly into the skin for an ethereal glass-skin radiance.",
      description: "Micro-milled baked rose pearl pigments that melt into the skin for an ethereal glass-skin radiance. Features 4 versatile shades for cheekbones, brow bones, and décolletage.",
      images: ["/uploads/products/item-09.jpeg", "/uploads/products/item-10.jpeg", "/uploads/products/item-11.jpeg", "/uploads/products/item-12.jpeg"],
    },
    {
      id: "prod-04",
      name: "Imperial Baroque Freshwater Pearl & Emerald Drop Necklace",
      slug: "imperial-baroque-freshwater-pearl-emerald-drop-necklace",
      cat: categories.jewelry,
      price: 7800,
      salePrice: 6450,
      sku: "VEL-PRL-01",
      stock: 15,
      isFeatured: true,
      tags: ["Pearls", "Emerald", "Luxury", "Royal Collection"],
      shortDescription: "Organic baroque freshwater pearls strung with 22K gold-plated accents and an emerald-cut radiant hydrothermal crystal pendant.",
      description: "Organic baroque freshwater pearls strung with 22K gold-plated accents and an emerald-cut radiant hydrothermal crystal pendant. A royal Pakistani heirloom piece inspired by Lahore heritage.",
      images: ["/uploads/products/item-13.jpeg", "/uploads/products/item-14.jpeg", "/uploads/products/item-15.jpeg", "/uploads/products/item-16.jpeg"],
    },
    {
      id: "prod-05",
      name: "Pure Damask Rose & Silk Peptide Dewy Setting Mist",
      slug: "pure-damask-rose-silk-peptide-dewy-setting-mist",
      cat: categories.skincare,
      price: 2250,
      salePrice: 1850,
      sku: "VEL-MST-01",
      stock: 45,
      isFeatured: false,
      tags: ["Skincare", "Rosewater", "Mist", "Silk Peptide", "Glow"],
      shortDescription: "Steam-distilled Damask rosewater infused with silk peptides, niacinamide, and hyaluronic acid for an instant dewy glow.",
      description: "Steam-distilled Damask rosewater infused with silk peptides, niacinamide, and hyaluronic acid. Locks makeup in place while imparting an instant dewy glow and soothing redness.",
      images: ["/uploads/products/item-17.jpeg", "/uploads/products/item-18.jpeg", "/uploads/products/item-19.jpeg", "/uploads/products/item-20.jpeg"],
    },
    {
      id: "prod-06",
      name: "Veloura Signature Gold Flake Hydrating Lip Treatment Oil",
      slug: "veloura-signature-gold-flake-hydrating-lip-treatment-oil",
      cat: categories.makeup,
      price: 1750,
      salePrice: 1450,
      sku: "VEL-OIL-01",
      stock: 60,
      isFeatured: true,
      tags: ["Lip Oil", "24K Gold", "Hydration", "Gloss"],
      shortDescription: "Suspended 24K gold nano-flakes in organic cold-pressed rosehip, camellia, and sweet almond oils.",
      description: "Suspended 24K gold nano-flakes in organic cold-pressed rosehip, camellia, and sweet almond oils. Softens chapped lips and provides a non-sticky glassy sheen with a subtle petal tint.",
      images: ["/uploads/products/item-21.jpeg", "/uploads/products/item-22.jpeg", "/uploads/products/item-23.jpeg", "/uploads/products/item-24.jpeg"],
    },
    {
      id: "prod-07",
      name: "Celestial Solitaire Crown Ring & Eternity Chevron Band",
      slug: "celestial-solitaire-crown-ring-eternity-band",
      cat: categories.jewelry,
      price: 3600,
      salePrice: 2890,
      sku: "VEL-RNG-01",
      stock: 25,
      isFeatured: false,
      tags: ["Ring", "Zirconia", "18K Gold Plated", "Gift for Her"],
      shortDescription: "A dazzling 2-carat diamond-brilliant round cut cubic zirconia nestled in a micro-pavé 18K gold band.",
      description: "A dazzling 2-carat diamond-brilliant round cut cubic zirconia nestled in a micro-pavé 18K gold band with matching nesting eternity chevron band. Hypoallergenic and scratch-resistant.",
      images: ["/uploads/products/item-25.jpeg", "/uploads/products/item-26.jpeg", "/uploads/products/item-27.jpeg", "/uploads/products/item-28.jpeg"],
    },
    {
      id: "prod-08",
      name: "Moroccan Cashmere Silk Nourishing Hair Oil Elixir",
      slug: "moroccan-cashmere-silk-nourishing-hair-oil-elixir",
      cat: categories.hair,
      price: 3200,
      salePrice: 2650,
      sku: "VEL-HAIR-02",
      stock: 30,
      isFeatured: true,
      tags: ["Hair Serum", "Argan Oil", "Cashmere Silk", "Heat Protectant"],
      shortDescription: "Liquid gold hair elixir formulated with Moroccan argan oil, keratin hydrolysate, and damask rose oil.",
      description: "Liquid gold hair elixir formulated with Moroccan argan oil, keratin hydrolysate, and damask rose oil. Protects from heat styling up to 230°C and leaves hair like pure spun silk.",
      images: ["/uploads/products/item-29.jpeg", "/uploads/products/item-30.jpeg", "/uploads/products/item-31.jpeg", "/uploads/products/item-32.jpeg"],
    },
    {
      id: "prod-09",
      name: "Midnight Jasmine & Velvet Amber Hair Perfume Mist",
      slug: "midnight-jasmine-velvet-amber-hair-perfume-mist",
      cat: categories.hair,
      price: 2800,
      salePrice: 2250,
      sku: "VEL-PERF-01",
      stock: 28,
      isFeatured: false,
      tags: ["Fragrance", "Hair Mist", "Jasmine", "Amber"],
      shortDescription: "An intoxicating alcohol-free hair mist enriched with provitamin B5 and sensory extracts of Sambac jasmine.",
      description: "An intoxicating alcohol-free hair mist enriched with provitamin B5 and sensory extracts of Sambac jasmine, cashmere musk, and warm amber. Lasts over 24 hours in the hair breeze.",
      images: ["/uploads/products/item-33.jpeg", "/uploads/products/item-34.jpeg", "/uploads/products/item-35.jpeg", "/uploads/products/item-36.jpeg"],
    },
    {
      id: "prod-10",
      name: "Ethereal Diamond Pavé Tennis Bracelet (3mm Sparkle)",
      slug: "ethereal-diamond-pave-tennis-bracelet-3mm",
      cat: categories.jewelry,
      price: 4500,
      salePrice: 3750,
      sku: "VEL-BRC-01",
      stock: 22,
      isFeatured: true,
      tags: ["Bracelet", "Tennis Bracelet", "Zirconia", "Diamond Sparkle"],
      shortDescription: "Continuous line of 3mm AAAAA grade cubic zirconia crystals with double safety clasp in platinum-gold bonded alloy.",
      description: "Continuous line of 3mm AAAAA grade cubic zirconia crystals with double safety clasp in platinum-gold bonded alloy. Shines with unmatched diamond fire under bridal chandeliers.",
      images: ["/uploads/products/item-37.jpeg", "/uploads/products/item-38.jpeg", "/uploads/products/item-39.jpeg", "/uploads/products/item-40.jpeg"],
    },
    {
      id: "prod-11",
      name: "Veloura Silk Veil Hydrating Skin Tint & Concealer",
      slug: "veloura-silk-veil-hydrating-skin-tint-concealer",
      cat: categories.makeup,
      price: 3100,
      salePrice: 2490,
      sku: "VEL-TNT-01",
      stock: 35,
      isFeatured: false,
      tags: ["Foundation", "Skin Tint", "SPF 30", "Dewy"],
      shortDescription: "Weightless serum foundation that blends seamlessly for medium buildable coverage with a soft-focus velvet matte skin finish.",
      description: "Weightless serum foundation that blends seamlessly for medium buildable coverage with a soft-focus velvet matte skin finish. Infused with SPF 30 and squalane for daily skin protection.",
      images: ["/uploads/products/item-41.jpeg", "/uploads/products/item-42.jpeg", "/uploads/products/item-43.jpeg", "/uploads/products/item-44.jpeg"],
    },
    {
      id: "prod-12",
      name: "Rose Quartz & Botanical Silk Plumping Facial Serum",
      slug: "rose-quartz-botanical-silk-plumping-facial-serum",
      cat: categories.skincare,
      price: 3900,
      salePrice: 3150,
      sku: "VEL-SRM-01",
      stock: 32,
      isFeatured: true,
      tags: ["Serum", "Hyaluronic", "Silk Peptides", "Glass Skin"],
      shortDescription: "Concentrated botanical youth serum infused with quadruple hyaluronic acid, rose quartz essence, and silk peptides.",
      description: "Concentrated botanical youth serum infused with quadruple hyaluronic acid, rose quartz essence, and silk peptides for intense cellular hydration and supple morning bounce.",
      images: ["/uploads/products/item-45.jpeg", "/uploads/products/item-46.jpeg", "/uploads/products/item-47.jpeg", "/uploads/products/item-48.jpeg"],
    },
    {
      id: "prod-13",
      name: "Vintage Filigree Crystal Jhumka & Tikka Set",
      slug: "vintage-filigree-crystal-jhumka-tikka-set",
      cat: categories.jewelry,
      price: 5900,
      salePrice: 4800,
      sku: "VEL-JHK-01",
      stock: 14,
      isFeatured: true,
      tags: ["Jhumka", "Tikka", "Bridal Jewelry", "Pakistani Tradition"],
      shortDescription: "Royal Mughal-inspired floral filigree traditional jhumkas with matching maang tikka.",
      description: "Royal Mughal-inspired floral filigree traditional jhumkas with matching maang tikka. Detailed with delicate seed pearl clusters and champagne stones for festive celebrations.",
      images: ["/uploads/products/item-49.jpeg", "/uploads/products/item-50.jpeg", "/uploads/products/item-51.jpeg", "/uploads/products/item-52.jpeg"],
    },
    {
      id: "prod-14",
      name: "Veloura Sunset Ombré Eyeshadow & Pigment Quad",
      slug: "veloura-sunset-ombre-eyeshadow-pigment-quad",
      cat: categories.makeup,
      price: 2700,
      salePrice: 2190,
      sku: "VEL-EYE-01",
      stock: 38,
      isFeatured: false,
      tags: ["Eyeshadow", "Pigment", "Crimson", "Burgundy"],
      shortDescription: "Buttery soft high-impact eyeshadows in velvet burgundy, copper foil shimmer, satin rose, and gilded champagne.",
      description: "Buttery soft high-impact eyeshadows in velvet burgundy, copper foil shimmer, satin rose, and gilded champagne. Intense one-swipe payoff with velvet blending technology.",
      images: ["/uploads/products/item-53.jpeg", "/uploads/products/item-54.jpeg", "/uploads/products/item-55.jpeg", "/uploads/products/item-56.jpeg"],
    },
    {
      id: "prod-15",
      name: "Hydra-Silk Sleeping Lip Butter Mask — Berry Rose",
      slug: "hydra-silk-sleeping-lip-butter-mask-berry-rose",
      cat: categories.makeup,
      price: 1650,
      salePrice: 1350,
      sku: "VEL-MSK-01",
      stock: 55,
      isFeatured: true,
      tags: ["Lip Mask", "Overnight Care", "Berry", "Butter"],
      shortDescription: "Overnight conditioning lip therapy formulated with berry fruit complex, murumuru butter, and candelilla wax.",
      description: "Overnight conditioning lip therapy formulated with berry fruit complex, murumuru butter, and candelilla wax to restore, plump, and deeply soothe dry or cracked lips.",
      images: ["/uploads/products/item-57.jpeg", "/uploads/products/item-58.jpeg", "/uploads/products/item-59.jpeg", "/uploads/products/item-60.jpeg"],
    },
    {
      id: "prod-16",
      name: "Royal Kundan Meenakari Choker & Pearl Baali Set",
      slug: "royal-kundan-meenakari-choker-pearl-baali-set",
      cat: categories.jewelry,
      price: 6800,
      salePrice: 5600,
      sku: "VEL-KND-01",
      stock: 12,
      isFeatured: true,
      tags: ["Kundan", "Meenakari", "Bridal Set", "Royal Jewellery"],
      shortDescription: "Exquisite hand-painted pink Meenakari reverse with Jadau Kundan work on gold foil setting.",
      description: "Exquisite hand-painted pink Meenakari reverse with Jadau Kundan work on gold foil setting, completed with freshwater pearl cascades. The crown jewel of wedding season.",
      images: ["/uploads/products/item-61.jpeg", "/uploads/products/item-62.jpeg", "/uploads/products/item-63.jpeg", "/uploads/products/item-64.jpeg"],
    },
    {
      id: "prod-17",
      name: "Luminous Silk Body Shimmer Dry Oil — Diamond Rose",
      slug: "luminous-silk-body-shimmer-dry-oil-diamond-rose",
      cat: categories.skincare,
      price: 3400,
      salePrice: 2750,
      sku: "VEL-BDY-01",
      stock: 26,
      isFeatured: false,
      tags: ["Body Oil", "Shimmer", "Glow", "French Vanilla"],
      shortDescription: "Fast-absorbing luxurious dry body oil infused with diamond mineral shimmer, marula oil, and French vanilla.",
      description: "Fast-absorbing luxurious dry body oil infused with diamond mineral shimmer, marula oil, and French vanilla fragrance. Gives an all-over goddess glow without staining clothes.",
      images: ["/uploads/products/item-65.jpeg", "/uploads/products/item-66.jpeg", "/uploads/products/item-67.jpeg", "/uploads/products/item-68.jpeg"],
    },
    {
      id: "prod-18",
      name: "Oud & Rose Damascena Royal Hair & Body Elixir",
      slug: "oud-rose-damascena-royal-hair-body-elixir",
      cat: categories.hair,
      price: 3750,
      salePrice: 3100,
      sku: "VEL-OUD-01",
      stock: 20,
      isFeatured: true,
      tags: ["Oud", "Damask Rose", "Perfume Oil", "Luxury Hair"],
      shortDescription: "An opulent fusion of Cambodian oud and Taif rose essential oils.",
      description: "An opulent fusion of Cambodian oud and Taif rose essential oils. Nourishes the scalp, scents hair for 24+ hours, and calms frizz while creating a captivating sillage.",
      images: ["/uploads/products/item-69.jpeg", "/uploads/products/item-70.jpeg", "/uploads/products/item-71.jpeg", "/uploads/products/item-72.jpeg"],
    },
    {
      id: "prod-19",
      name: "Dainty Evil Eye & Pearl Charm Layering Necklace",
      slug: "dainty-evil-eye-pearl-charm-layering-necklace",
      cat: categories.jewelry,
      price: 2800,
      salePrice: 2290,
      sku: "VEL-EVL-01",
      stock: 34,
      isFeatured: false,
      tags: ["Evil Eye", "Layering Necklace", "Protection", "Pearls"],
      shortDescription: "18K gold-plated double-strand layering necklace featuring a sapphire-blue mother-of-pearl evil eye talisman.",
      description: "18K gold-plated double-strand layering necklace featuring a sapphire-blue mother-of-pearl evil eye talisman and miniature freshwater pearl droplets. Elegant everyday protection.",
      images: ["/uploads/products/item-73.jpeg", "/uploads/products/item-74.jpeg", "/uploads/products/item-75.jpeg", "/uploads/products/item-76.jpeg"],
    },
    {
      id: "prod-20",
      name: "Atelier Silk Touch Beauty Blender & Velvet Powder Puff Trio",
      slug: "atelier-silk-touch-beauty-blender-velvet-powder-puff-trio",
      cat: categories.makeup,
      price: 1450,
      salePrice: 1150,
      sku: "VEL-ACC-01",
      stock: 75,
      isFeatured: false,
      tags: ["Sponges", "Beauty Blender", "Puff", "Makeup Tools"],
      shortDescription: "Ultra-plush hydrophilic polyurethane cosmetic sponges paired with triangular velvet powder puffs.",
      description: "Ultra-plush hydrophilic polyurethane cosmetic sponges paired with triangular velvet powder puffs for streak-free airbrushed foundation and baking application.",
      images: ["/uploads/products/item-77.jpeg", "/uploads/products/item-78.jpeg", "/uploads/products/item-79.jpeg", "/uploads/products/item-80.jpeg"],
    },
    {
      id: "prod-21",
      name: "Emerald & Baguette Crystal Statement Cocktail Ring",
      slug: "emerald-baguette-crystal-statement-cocktail-ring",
      cat: categories.jewelry,
      price: 3200,
      salePrice: 2550,
      sku: "VEL-RNG-02",
      stock: 28,
      isFeatured: true,
      tags: ["Ring", "Emerald Cut", "Cocktail Ring", "Statement"],
      shortDescription: "A bold emerald-cut hydrothermal green quartz bordered with tapered baguette micro-crystals.",
      description: "A bold emerald-cut hydrothermal green quartz bordered with tapered baguette micro-crystals on an adjustable 18K gold band. Turns heads at every dinner and wedding.",
      images: ["/uploads/products/item-81.jpeg", "/uploads/products/item-82.jpeg", "/uploads/products/item-83.jpeg", "/uploads/products/item-84.jpeg"],
    },
    {
      id: "prod-22",
      name: "Veloura Velvet Rose Bouquet Luxury Gift Box & Hamper",
      slug: "veloura-velvet-rose-bouquet-luxury-gift-box-hamper",
      cat: categories.makeup,
      price: 8900,
      salePrice: 7490,
      sku: "VEL-GFT-01",
      stock: 15,
      isFeatured: true,
      tags: ["Gift Box", "Hamper", "Velvet Box", "Bridal Gift", "VIP"],
      shortDescription: "The ultimate luxury present: includes Velvet Lip Casket, Starlight Earrings, Silk Glow Serum, and a silk rose in a crimson velvet box.",
      description: "The ultimate luxury present: includes Velvet Lip Casket, Starlight Earrings, Silk Glow Serum, and a handcrafted silk rose in an embossed crimson velvet presentation box with complimentary gold ribboning.",
      images: ["/uploads/products/item-85.jpeg", "/uploads/products/item-86.jpeg", "/uploads/products/item-01.jpeg", "/uploads/products/item-05.jpeg"],
    },
  ];

  return rawList.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    shortDescription: item.shortDescription,
    price: item.price,
    salePrice: item.salePrice,
    sku: item.sku,
    category: item.cat,
    brand: "VELOURA Haute Atelier",
    stock: item.stock,
    isPublished: true,
    isFeatured: item.isFeatured,
    tags: item.tags,
    images: item.images.map((url, idx) => ({
      id: `${item.id}-img-${idx + 1}`,
      url,
      alt: item.name,
      isPrimary: idx === 0,
      sortOrder: idx,
    })),
    sellerId: "usr-seller-1",
    sellerName: "Lahore Heritage Pearls & Jewels",
    createdAt: new Date().toISOString(),
  }));
}

interface DBState {
  users: StoreUser[];
  products: StoreProduct[];
}

let memoryState: DBState | null = null;

function loadDb(): DBState {
  if (memoryState) return memoryState;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.products.length > 0) {
        memoryState = parsed;
        return memoryState!;
      }
    }
  } catch (err) {
    console.error("Error reading store db file, re-initializing:", err);
  }

  // Initialize fresh
  memoryState = {
    users: defaultUsers,
    products: generateDefaultProducts(),
  };

  saveDb(memoryState);
  return memoryState;
}

function saveDb(state: DBState) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store db file:", err);
  }
}

// Public Store API functions
export async function getStoreProducts(filter?: {
  categorySlug?: string | null;
  featured?: boolean;
  search?: string | null;
  sort?: string;
  limit?: number;
}): Promise<StoreProduct[]> {
  const db = loadDb();
  let list = db.products.filter((p) => p.isPublished);

  if (filter?.categorySlug) {
    list = list.filter((p) => p.category.slug === filter.categorySlug);
  }

  if (filter?.featured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filter?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filter?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (filter?.limit) {
    list = list.slice(0, filter.limit);
  }

  return list;
}

export async function getStoreProductBySlugOrId(identifier: string): Promise<StoreProduct | null> {
  const db = loadDb();
  return db.products.find((p) => p.slug === identifier || p.id === identifier) || null;
}

export async function upsertStoreProduct(productData: Partial<StoreProduct>): Promise<StoreProduct> {
  const db = loadDb();
  let prodIndex = -1;

  if (productData.id) {
    prodIndex = db.products.findIndex((p) => p.id === productData.id);
  } else if (productData.slug) {
    prodIndex = db.products.findIndex((p) => p.slug === productData.slug);
  }

  if (prodIndex >= 0) {
    // Update existing
    const existing = db.products[prodIndex];
    const updated: StoreProduct = {
      ...existing,
      ...productData,
      id: existing.id,
      slug: productData.slug || existing.slug,
      price: Number(productData.price ?? existing.price),
      salePrice: productData.salePrice !== undefined ? (productData.salePrice ? Number(productData.salePrice) : null) : existing.salePrice,
      images: productData.images || existing.images,
    };
    db.products[prodIndex] = updated;
    saveDb(db);
    return updated;
  } else {
    // Create new
    const newId = productData.id || `prod-${Date.now()}`;
    const newSlug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`);
    const newProduct: StoreProduct = {
      id: newId,
      name: productData.name || "Untitled Product",
      slug: newSlug,
      description: productData.description || "",
      shortDescription: productData.shortDescription || "",
      price: Number(productData.price || 0),
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      sku: productData.sku || `VEL-SKU-${Date.now().toString().slice(-4)}`,
      category: productData.category || { id: "cat-1", name: "Luxe Makeup & Lips", slug: "luxe-makeup" },
      brand: productData.brand || "VELOURA Haute Atelier",
      stock: Number(productData.stock ?? 10),
      isPublished: productData.isPublished !== undefined ? Boolean(productData.isPublished) : true,
      isFeatured: Boolean(productData.isFeatured),
      tags: productData.tags || [],
      images: productData.images || [{ id: `${newId}-1`, url: "/uploads/products/item-01.jpeg", isPrimary: true }],
      sellerId: productData.sellerId || "usr-admin-1",
      sellerName: productData.sellerName || "Veloura Atelier Admin",
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    saveDb(db);
    return newProduct;
  }
}

export async function deleteStoreProduct(id: string): Promise<boolean> {
  const db = loadDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// User / People management functions (Daraz / Temu Style)
export async function getStoreUsers(): Promise<StoreUser[]> {
  const db = loadDb();
  return db.users;
}

export async function addStoreUser(userData: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "ADMIN" | "STAFF" | "SELLER" | "CUSTOMER";
  sellerShopName?: string;
  sellerCommission?: number;
}): Promise<StoreUser> {
  const db = loadDb();
  const cleanEmail = userData.email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error("User with this email already exists in Atelier");
  }

  const rawPassword = userData.password || "welcome123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const newUser: StoreUser = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: userData.name.trim(),
    email: cleanEmail,
    phone: userData.phone?.trim() || "",
    role: userData.role,
    passwordHash,
    sellerShopName: userData.sellerShopName?.trim() || (userData.role === "SELLER" ? `${userData.name}'s Shop` : undefined),
    sellerCommission: userData.sellerCommission !== undefined ? Number(userData.sellerCommission) : (userData.role === "SELLER" ? 10 : undefined),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };

  db.users.unshift(newUser);
  saveDb(db);
  return newUser;
}

export async function updateStoreUser(id: string, updates: Partial<StoreUser>): Promise<StoreUser | null> {
  const db = loadDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  db.users[idx] = {
    ...db.users[idx],
    ...updates,
    id: db.users[idx].id,
  };
  saveDb(db);
  return db.users[idx];
}

export async function deleteStoreUser(id: string): Promise<boolean> {
  const db = loadDb();
  const target = db.users.find((u) => u.id === id);
  if (target && target.email === "admin@veloura.pk") {
    throw new Error("Super Admin cannot be deleted");
  }
  const initialLen = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  if (db.users.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function findUserByEmail(email: string): Promise<StoreUser | null> {
  const db = loadDb();
  const cleanEmail = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}
