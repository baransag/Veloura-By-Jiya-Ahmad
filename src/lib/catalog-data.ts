export interface CatalogItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  sku: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  universe: "JEWELRY" | "BEAUTY_SKIN_HAIR";
  subCategory: string;
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
  sellerShopName?: string;
  sellerBasePrice?: number;
  adminProfitMargin?: number;
  createdAt: string;
}

export const UNIVERSES = [
  {
    id: "ALL",
    name: "All Creations",
    shortName: "All",
    icon: "✨",
    slug: "all",
    description: "The complete atelier collection of fine ornaments and silk beauty",
  },
  {
    id: "JEWELRY",
    name: "Fine Jewellery & Pearls",
    shortName: "Fine Jewellery",
    icon: "💎",
    slug: "fine-jewelry",
    description: "18K & 22K gold-plated bridal chokers, freshwater baroque pearls & zircon solitaires",
  },
  {
    id: "BEAUTY_SKIN_HAIR",
    name: "Silk Skincare, Facewash & Hair",
    shortName: "Skincare & Hair",
    icon: "🌸",
    slug: "beauty-skin-hair",
    description: "Botanical facewashes, bio-silk peptide serums & Moroccan argan hair elixirs",
  },
] as const;

export const JEWELRY_SUB_CATEGORIES = [
  "All Jewels",
  "Chokers & Necklaces",
  "Earrings & Jhumkas",
  "Rings & Solitaires",
  "Bridal Sets & Bangles",
] as const;

export const BEAUTY_SUB_CATEGORIES = [
  "All Beauty",
  "Facewash & Cleansers",
  "Silk Serums & Glow",
  "Hair Oils & Elixirs",
  "Luxe Lip Care",
] as const;

// Base product blueprints for Jewels (items 1-100)
const jewelryTemplates = [
  {
    name: "24K Gold Starlight Pavé Zircon Choker Set",
    subCategory: "Chokers & Necklaces",
    basePrice: 4800,
    tags: ["18K Gold Plated", "Choker", "Zircon", "Bridal", "Necklace"],
    desc: "Handcrafted 24K gold-plated bridal soiree choker encrusted with high-fire pavé cubic zircon stones and matching drop earrings. Tarnish-free and hypoallergenic.",
  },
  {
    name: "Imperial Baroque Freshwater Pearl & Emerald Drop Necklace",
    subCategory: "Chokers & Necklaces",
    basePrice: 5600,
    tags: ["Freshwater Pearls", "Emerald", "Royal Heritage", "Necklace"],
    desc: "Organic baroque freshwater pearls strung with 22K gold-plated accents and an emerald-cut radiant hydrothermal crystal pendant.",
  },
  {
    name: "Royal Mughal Jadau Kundan Meenakari Choker & Jhumka Set",
    subCategory: "Bridal Sets & Bangles",
    basePrice: 7200,
    tags: ["Kundan", "Meenakari", "Bridal", "Jhumka", "Lahore Heritage"],
    desc: "Exquisite hand-painted pink Meenakari reverse with Jadau Kundan work on gold foil setting, completed with freshwater pearl cascades.",
  },
  {
    name: "Celestial Solitaire Crown Ring & Eternity Chevron Band",
    subCategory: "Rings & Solitaires",
    basePrice: 2400,
    tags: ["Ring", "Solitaire", "Zircon", "18K Gold Plated"],
    desc: "A dazzling 2-carat diamond-brilliant round cut cubic zirconia nestled in a micro-pavé 18K gold band with matching nesting eternity chevron band.",
  },
  {
    name: "Emerald & Baguette Crystal Statement Cocktail Ring",
    subCategory: "Rings & Solitaires",
    basePrice: 2600,
    tags: ["Cocktail Ring", "Emerald Cut", "Statement", "Gold Plated"],
    desc: "A bold emerald-cut hydrothermal green quartz bordered with tapered baguette micro-crystals on an adjustable 18K gold band.",
  },
  {
    name: "Heritage Floral Filigree Pearl Jhumkas & Maang Tikka",
    subCategory: "Earrings & Jhumkas",
    basePrice: 3800,
    tags: ["Jhumkas", "Maang Tikka", "Seed Pearls", "Wedding"],
    desc: "Royal Mughal-inspired floral filigree traditional jhumkas with matching maang tikka. Detailed with delicate seed pearl clusters and champagne stones.",
  },
  {
    name: "Baroque Pearl Tassel Drop Earrings in 18K Gold Vermeil",
    subCategory: "Earrings & Jhumkas",
    basePrice: 2900,
    tags: ["Pearl Earrings", "18K Vermeil", "Drop Earrings", "Minimal Luxury"],
    desc: "Grade-AAA lustrous teardrop baroque freshwater pearls suspended from geometric 18K gold vermeil links. Lightweight and timeless.",
  },
  {
    name: "Veloura Signature Pavé Diamond Tennis Bracelet",
    subCategory: "Bridal Sets & Bangles",
    basePrice: 3900,
    tags: ["Tennis Bracelet", "Pavé Diamond", "Zircon", "Everyday Luxury"],
    desc: "Seamless row of brilliant-cut pavé zirconia stones set in platinum-rhodium dipped sterling silver. Features double-security clasp lock.",
  },
  {
    name: "Dainty Evil Eye & Pearl Charm Layering Necklace",
    subCategory: "Chokers & Necklaces",
    basePrice: 2100,
    tags: ["Evil Eye", "Layering Necklace", "Pearls", "Talisman"],
    desc: "18K gold-plated double-strand layering necklace featuring a sapphire-blue mother-of-pearl evil eye talisman and miniature freshwater pearl droplets.",
  },
  {
    name: "Regal Polki Diamond Cut Traditional Kara Bangles (Pair)",
    subCategory: "Bridal Sets & Bangles",
    basePrice: 5200,
    tags: ["Bangles", "Kara", "Polki Diamond", "Traditional"],
    desc: "Handcrafted pair of royal Polki kara bangles with openable screw clasps, embellished with uncut stone simulants and ruby glass accents.",
  },
];

// Base product blueprints for Beauty, Skincare & Hair (items 101-199)
const beautyTemplates = [
  {
    name: "Damask Rose & Silk Peptide Gentle Foaming Facewash",
    subCategory: "Facewash & Cleansers",
    basePrice: 1650,
    tags: ["Facewash", "Rosewater", "Silk Peptide", "Hydrating", "Cleanser"],
    desc: "A sulfate-free, pH-balanced cloud foaming facewash steam-distilled from organic Damask rose petals. Dissolves impurities without stripping moisture.",
  },
  {
    name: "Rice Water & Japanese Camellia Milky Brightening Cleanser",
    subCategory: "Facewash & Cleansers",
    basePrice: 1750,
    tags: ["Facewash", "Rice Water", "Brightening", "Milky Cleanser", "Korean Glass Skin"],
    desc: "Fermented rice water paired with cold-pressed Japanese camellia seed oil to deeply cleanse pores and impart a luminous porcelain clarity.",
  },
  {
    name: "24K Bio-Gold Radiance Cleansing Gel & Exfoliating Polish",
    subCategory: "Facewash & Cleansers",
    basePrice: 1950,
    tags: ["Facewash", "24K Gold", "Gel Cleanser", "Gentle Polish", "Glow"],
    desc: "Infused with suspended 24K cosmetic gold flakes and crushed apricot seed micro-pearls for gentle daily resurfacing and radiant glow.",
  },
  {
    name: "Tea Tree & Centella Asiatica Calming Clarifying Facewash",
    subCategory: "Facewash & Cleansers",
    basePrice: 1550,
    tags: ["Facewash", "Acne Safe", "Centella", "Tea Tree", "Pore Cleansing"],
    desc: "Formulated for sensitive and breakout-prone skin with pure tea tree hydrosol and cica to calm redness, control sebum, and clarify skin texture.",
  },
  {
    name: "Bio-Fermented Silk Peptide Glass Dew Serum",
    subCategory: "Silk Serums & Glow",
    basePrice: 2450,
    tags: ["Silk Peptide", "Glass Skin", "Serum", "Hyaluronic Acid", "Anti-Aging"],
    desc: "Hydrolyzed cocoon silk proteins combined with multi-weight hyaluronic acid to plump fine lines and seal in glass-skin hydration for 24 hours.",
  },
  {
    name: "24K Gold Flake Rosehip Botanical Glow Facial Elixir",
    subCategory: "Silk Serums & Glow",
    basePrice: 2800,
    tags: ["Face Oil", "24K Gold", "Rosehip Oil", "Night Elixir", "Luminous"],
    desc: "Cold-pressed Chilean rosehip seed oil suspended with real 24K gold nano-leaves. Rejuvenates dull skin overnight with vitamins A, C, and E.",
  },
  {
    name: "Pure Damask Rose & Niacinamide Dewy Setting & Glow Mist",
    subCategory: "Silk Serums & Glow",
    basePrice: 1850,
    tags: ["Face Mist", "Rosewater", "Setting Spray", "Niacinamide", "Dewy"],
    desc: "Hydrating micro-fine mist infused with pure Damask rose extract and 5% niacinamide to lock makeup in place and refresh dry skin throughout the day.",
  },
  {
    name: "Moroccan Cashmere Silk Nourishing Hair Oil Elixir",
    subCategory: "Hair Oils & Elixirs",
    basePrice: 2650,
    tags: ["Hair Oil", "Argan Oil", "Heat Protectant", "Keratin", "Frizz Control"],
    desc: "Liquid gold hair elixir formulated with pure Moroccan argan oil, silk amino acids, and vitamin E. Protects up to 230°C and leaves hair like spun silk.",
  },
  {
    name: "Midnight Jasmine & Velvet Amber Silk Hair Perfume Mist",
    subCategory: "Hair Oils & Elixirs",
    basePrice: 2250,
    tags: ["Hair Perfume", "Jasmine", "Amber", "Silk Mist", "Long Lasting"],
    desc: "An alcohol-free, moisture-rich hair mist that veils your tresses in intoxicating notes of Sambac jasmine, warm cashmeran amber, and sweet vanilla.",
  },
  {
    name: "Veloura Velvet Silk Liquid Lip Rouge — Rose Truffle",
    subCategory: "Luxe Lip Care",
    basePrice: 1850,
    tags: ["Lipstick", "Liquid Matte", "Velvet Silk", "Hydrating", "Rose Truffle"],
    desc: "Weightless velvet matte mousse enriched with pure silk amino acids and jojoba oil. Delivers 16-hour transfer-proof petal perfection without drying.",
  },
  {
    name: "Signature 24K Gold Flake Hydrating Lip Treatment Oil",
    subCategory: "Luxe Lip Care",
    basePrice: 1450,
    tags: ["Lip Oil", "24K Gold", "Plumping", "Gloss", "Hydration"],
    desc: "Non-sticky glassy lip nectar packed with vitamin E and botanical peptides. Plumps lips and leaves a subtle, healthy pink rose petal sheen.",
  },
  {
    name: "Velvet Matte Lip Casket — 6 Iconic Luxe Shades Gift Box",
    subCategory: "Luxe Lip Care",
    basePrice: 3200,
    tags: ["Lip Casket", "Set of 6", "Matte", "Gift Box", "Best Seller"],
    desc: "An opulent gift casket featuring 6 full-size velvet matte liquid silks in nude blush, royal ruby, mauve rose, and deep plum.",
  },
];

export function generateAll199Products(): CatalogItem[] {
  const products: CatalogItem[] = [];
  const adminMarginPct = 15; // 15% default admin profit margin

  // 199 total images: item-01.jpeg to item-199.jpeg
  for (let i = 1; i <= 199; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    const imgUrl = `/uploads/products/item-${numStr}.jpeg`;
    const isJewelry = i <= 100;

    let template: any;
    let universe: "JEWELRY" | "BEAUTY_SKIN_HAIR";
    let catObj: { id: string; name: string; slug: string };

    if (isJewelry) {
      universe = "JEWELRY";
      template = jewelryTemplates[(i - 1) % jewelryTemplates.length];
      catObj = {
        id: "cat-2",
        name: "Fine Jewelry & Pearls",
        slug: "fine-jewelry",
      };
    } else {
      universe = "BEAUTY_SKIN_HAIR";
      template = beautyTemplates[(i - 101) % beautyTemplates.length];
      if (template.subCategory === "Hair Oils & Elixirs") {
        catObj = { id: "cat-4", name: "Hair Elixirs & Fragrance", slug: "hair-fragrance" };
      } else if (template.subCategory === "Luxe Lip Care") {
        catObj = { id: "cat-1", name: "Luxe Makeup & Lips", slug: "luxe-makeup" };
      } else {
        catObj = { id: "cat-3", name: "Silk Skincare & Glow", slug: "silk-skincare" };
      }
    }

    // Varied luxury naming per item
    const variantSuffix = i > 10 ? ` — Edition No. ${i}` : "";
    const name = `${template.name}${variantSuffix}`;
    const slug = `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ed-${i}`;

    // Price calculations:
    // Seller Base Price + Admin Profit Margin (15%) = Retail Price
    const sellerBase = Math.round((template.basePrice + ((i * 37) % 700)) / 50) * 50;
    const adminProfit = Math.round(sellerBase * (adminMarginPct / 100));
    const retailPrice = sellerBase + adminProfit;

    // Some products on sale
    const isOnSale = i % 3 === 0 || i <= 8;
    const saleDiscount = isOnSale ? Math.round(retailPrice * 0.2) : 0;
    const salePrice = isOnSale ? retailPrice - saleDiscount : null;

    // Multi-angle secondary images
    const nextImg1 = ((i % 199) + 1);
    const nextImg2 = (((i + 5) % 199) + 1);
    const num1 = nextImg1 < 10 ? `0${nextImg1}` : `${nextImg1}`;
    const num2 = nextImg2 < 10 ? `0${nextImg2}` : `${nextImg2}`;

    products.push({
      id: `prod-${numStr}`,
      name,
      slug,
      description: template.desc,
      shortDescription: template.desc.slice(0, 110) + "...",
      price: retailPrice,
      salePrice,
      sku: `VEL-${universe === "JEWELRY" ? "JWL" : "BEAUTY"}-${numStr}`,
      category: catObj,
      universe,
      subCategory: template.subCategory,
      brand: "VELOURA Haute Atelier",
      stock: 12 + (i % 35),
      isPublished: true,
      isFeatured: i <= 16 || i % 15 === 0,
      tags: [...template.tags, universe === "JEWELRY" ? "Jewellery" : "Silk Beauty"],
      images: [
        {
          id: `prod-${numStr}-img-1`,
          url: imgUrl,
          alt: name,
          isPrimary: true,
          sortOrder: 0,
        },
        {
          id: `prod-${numStr}-img-2`,
          url: `/uploads/products/item-${num1}.jpeg`,
          alt: `${name} Detail Angle`,
          isPrimary: false,
          sortOrder: 1,
        },
        {
          id: `prod-${numStr}-img-3`,
          url: `/uploads/products/item-${num2}.jpeg`,
          alt: `${name} Presentation Box`,
          isPrimary: false,
          sortOrder: 2,
        },
      ],
      sellerId: i % 2 === 0 ? "usr-seller-1" : "usr-admin-1",
      sellerName: i % 2 === 0 ? "Lahore Heritage Pearls & Jewels" : "Veloura Atelier Admin",
      sellerShopName: i % 2 === 0 ? "Lahore Heritage Jewels" : "Veloura Atelier Official",
      sellerBasePrice: sellerBase,
      adminProfitMargin: adminMarginPct,
      createdAt: new Date(Date.now() - i * 3600 * 1000 * 4).toISOString(),
    });
  }

  return products;
}
