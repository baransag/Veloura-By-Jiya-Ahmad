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


