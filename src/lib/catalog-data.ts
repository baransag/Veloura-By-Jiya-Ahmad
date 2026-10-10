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
  subCategory?: string;
  brand: string;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  isDeal?: boolean;
  dealBadge?: string;
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
  {
    id: "DEALS",
    name: "Exclusive Deals & Bundles",
    shortName: "Deals & Bundles",
    icon: "🔥",
    slug: "deals",
    description: "Limited time discounted beauty hampers, bridal bundles, and flash deals",
  },
] as const;

export const JEWELRY_SUB_CATEGORIES = [
  "All Jewels",
  "Bridal Chokers & Necklaces",
  "Earrings & Traditional Jhumkas",
  "Rings & Solitaires",
  "Royal Kundan & Bangles",
  "Freshwater Baroque Pearls",
];

export const BEAUTY_SUB_CATEGORIES = [
  "All Beauty",
  "Silk Skincare & Serums",
  "Facewash & Cleansers",
  "Hair Elixirs & Fragrance",
  "Luxe Lip Care & Velvet Rouges",
  "Exfoliators & Face Polishes",
];

export const LUXURY_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF5F8"/>
      <stop offset="50%" stop-color="#FFEBF2"/>
      <stop offset="100%" stop-color="#FCE7EC"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <rect x="25" y="25" width="550" height="550" fill="none" stroke="#F8D5DE" stroke-width="2" rx="20"/>
  <rect x="35" y="35" width="530" height="530" fill="none" stroke="#C2185B" stroke-opacity="0.25" stroke-width="1" rx="16"/>
  <circle cx="300" cy="260" r="65" fill="#FFFFFF" stroke="#F8D5DE" stroke-width="2"/>
  <path d="M300 225 L322 258 L300 290 L278 258 Z" fill="none" stroke="#C2185B" stroke-width="2"/>
  <circle cx="300" cy="258" r="7" fill="#E14D75"/>
  <text x="300" y="370" font-family="Georgia, serif" font-size="26" fill="#25050D" font-weight="600" text-anchor="middle" letter-spacing="5">VELOURA</text>
  <text x="300" y="400" font-family="Arial, sans-serif" font-size="11" fill="#8E1B3B" font-weight="bold" text-anchor="middle" letter-spacing="6">HAUTE ATELIER</text>
</svg>
`);

export const DEFAULT_JEWELRY_SHOWCASE: CatalogItem[] = [
  {
    id: "showcase-jewel-1",
    name: "Imperial Baroque Freshwater Pearl & Emerald Drop Necklace",
    slug: "imperial-baroque-pearl-emerald-choker",
    description: "Handcrafted 18K gold-plated bridal choker stringed with organic natural baroque pearls and deep Colombian emerald cut drop.",
    shortDescription: "18K gold-plated bridal choker with organic baroque pearls & emerald drop.",
    price: 4850,
    salePrice: 3950,
    sku: "VEL-JW-01",
    category: { id: "cat-chokers", name: "Bridal Chokers & Necklaces", slug: "chokers-necklaces" },
    universe: "JEWELRY",
    subCategory: "Bridal Chokers & Necklaces",
    brand: "VELOURA Haute Joaillerie",
    stock: 12,
    isPublished: true,
    isFeatured: true,
    isDeal: true,
    dealBadge: "ROYAL ATELIER",
    tags: ["18K Gold", "Baroque Pearl", "Bridal"],
    images: [{ id: "img-j1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-jewel-2",
    name: "2-Carat Crown Solitaire Zircon Ring",
    slug: "2-carat-crown-solitaire-zircon-ring",
    description: "Brilliant 2-carat diamond simulant zircon set in a four-prong royal tiara crown setting with micropavé shank.",
    shortDescription: "2-carat royal solitaire ring in tiara crown setting.",
    price: 3400,
    salePrice: 2800,
    sku: "VEL-JW-02",
    category: { id: "cat-rings", name: "Rings & Solitaires", slug: "rings-solitaires" },
    universe: "JEWELRY",
    subCategory: "Rings & Solitaires",
    brand: "VELOURA Haute Joaillerie",
    stock: 15,
    isPublished: true,
    isFeatured: true,
    tags: ["Solitaire", "Zircon", "18K Plated"],
    images: [{ id: "img-j2", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-jewel-3",
    name: "Handcrafted Mughal Meenakari Pearl Chandbalis",
    slug: "handcrafted-mughal-meenakari-chandbalis",
    description: "Authentic hand-painted Meenakari floral earrings with hanging pearl clusters and 22K gold foil finish.",
    shortDescription: "Hand-painted Mughal Meenakari chandbalis with pearl tassels.",
    price: 4200,
    salePrice: 3500,
    sku: "VEL-JW-03",
    category: { id: "cat-earrings", name: "Earrings & Traditional Jhumkas", slug: "earrings-jhumkas" },
    universe: "JEWELRY",
    subCategory: "Earrings & Traditional Jhumkas",
    brand: "VELOURA Haute Joaillerie",
    stock: 9,
    isPublished: true,
    isFeatured: true,
    tags: ["Meenakari", "Chandbalis", "Traditional"],
    images: [{ id: "img-j3", url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-jewel-4",
    name: "Celestial Pavé Diamond Zircon Tennis Bracelet",
    slug: "celestial-pave-diamond-tennis-bracelet",
    description: "Triple-layer 18K gold-plated tennis bracelet with AAAAA sparkle zircons and double security box clasp.",
    shortDescription: "Triple 18K gold-plated tennis bracelet with AAAAA zircons.",
    price: 3800,
    salePrice: 3200,
    sku: "VEL-JW-04",
    category: { id: "cat-bangles", name: "Royal Kundan & Bangles", slug: "kundan-bangles" },
    universe: "JEWELRY",
    subCategory: "Royal Kundan & Bangles",
    brand: "VELOURA Haute Joaillerie",
    stock: 14,
    isPublished: true,
    isFeatured: true,
    isDeal: true,
    dealBadge: "HOT SELLER",
    tags: ["Tennis Bracelet", "Zircon", "Tarnish-Free"],
    images: [{ id: "img-j4", url: "https://images.unsplash.com/photo-1611591475878-360cb4cb941e?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
];

export const DEFAULT_BEAUTY_SHOWCASE: CatalogItem[] = [
  {
    id: "showcase-beauty-1",
    name: "Damask Rose & Silk Peptide Gentle Foaming Cleanser",
    slug: "damask-rose-silk-peptide-foaming-cleanser",
    description: "Ultra-gentle cloud foaming facewash infused with organic Damask rose hydrosol, bio-fermented silk peptides, and niacinamide.",
    shortDescription: "Cloud foaming facewash with Damask rose & silk peptides.",
    price: 2450,
    salePrice: 1950,
    sku: "VEL-BT-01",
    category: { id: "cat-facewash", name: "Facewash & Cleansers", slug: "facewash-cleansers" },
    universe: "BEAUTY_SKIN_HAIR",
    subCategory: "Facewash & Cleansers",
    brand: "VELOURA Botanical Atelier",
    stock: 25,
    isPublished: true,
    isFeatured: true,
    isDeal: true,
    dealBadge: "BESTSELLER",
    tags: ["Facewash", "Rose", "Silk Peptides"],
    images: [{ id: "img-b1", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-beauty-2",
    name: "Moroccan Cashmere Silk Nourishing Hair Oil Elixir",
    slug: "moroccan-cashmere-silk-hair-oil-elixir",
    description: "Lightweight golden hair nectar enriched with pure Moroccan argan, camellia seed oil, and hydrolysed silk amino acids.",
    shortDescription: "Moroccan argan & hydrolysed silk hair oil elixir.",
    price: 3200,
    salePrice: 2650,
    sku: "VEL-BT-02",
    category: { id: "cat-hair", name: "Hair Elixirs & Fragrance", slug: "hair-fragrance" },
    universe: "BEAUTY_SKIN_HAIR",
    subCategory: "Hair Elixirs & Fragrance",
    brand: "VELOURA Botanical Atelier",
    stock: 20,
    isPublished: true,
    isFeatured: true,
    tags: ["Hair Oil", "Argan", "Silk Glaze"],
    images: [{ id: "img-b2", url: "https://images.unsplash.com/photo-1608248597359-54848126b86b?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-beauty-3",
    name: "24K Gold Flecked Velvet Hydration Lip Oil",
    slug: "24k-gold-velvet-hydration-lip-oil",
    description: "Plumping, mirror-shine lip glaze suspended with authentic 24K gold flakes, rosehip seed extract, and hyaluronic spheres.",
    shortDescription: "24K gold-infused plumping velvet lip oil nectar.",
    price: 1850,
    salePrice: 1450,
    sku: "VEL-BT-03",
    category: { id: "cat-lips", name: "Luxe Lip Care & Velvet Rouges", slug: "luxe-lips" },
    universe: "BEAUTY_SKIN_HAIR",
    subCategory: "Luxe Lip Care & Velvet Rouges",
    brand: "VELOURA Botanical Atelier",
    stock: 30,
    isPublished: true,
    isFeatured: true,
    isDeal: true,
    dealBadge: "VIRAL DROP",
    tags: ["Lip Oil", "24K Gold", "Hydration"],
    images: [{ id: "img-b3", url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "showcase-beauty-4",
    name: "Bio-Fermented Silk Dew Glow Recovery Serum",
    slug: "bio-fermented-silk-dew-glow-serum",
    description: "Intense barrier-restoring concentrated nectar with 5% multi-molecular hyaluronic acid, white truffle extract, and pure silk amino acids.",
    shortDescription: "5% HA & silk peptide dewy glow recovery serum.",
    price: 3600,
    salePrice: 2950,
    sku: "VEL-BT-04",
    category: { id: "cat-skincare", name: "Silk Skincare & Serums", slug: "silk-skincare" },
    universe: "BEAUTY_SKIN_HAIR",
    subCategory: "Silk Skincare & Serums",
    brand: "VELOURA Botanical Atelier",
    stock: 18,
    isPublished: true,
    isFeatured: true,
    tags: ["Serum", "Glow", "Silk Dew"],
    images: [{ id: "img-b4", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 }],
    createdAt: "2026-10-01T00:00:00.000Z",
  },
];


