import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { CatalogItem } from "./catalog-data";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  universe: "JEWELRY" | "BEAUTY_SKIN_HAIR";
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "SELLER" | "CUSTOMER";
  passwordHash: string;
  sellerShopName?: string;
  sellerBio?: string;
  sellerWhatsApp?: string;
  sellerInstagram?: string;
  sellerTikTok?: string;
  sellerFacebook?: string;
  sellerCity?: string;
  sellerCommission?: number; // admin profit margin %
  adminProfitMargin?: number; // e.g. 15 for 15%
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export type StoreProduct = CatalogItem;

// Default initial categories that Admin can manage and expand
const defaultCategories: StoreCategory[] = [
  {
    id: "cat-skincare",
    name: "Silk Skincare & Serums",
    slug: "silk-skincare",
    universe: "BEAUTY_SKIN_HAIR",
    description: "Bio-fermented silk peptides, rose damascena toners & night glow elixirs",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-facewash",
    name: "Facewash & Cleansers",
    slug: "facewash-cleansers",
    universe: "BEAUTY_SKIN_HAIR",
    description: "Cloud foaming rose cleansers, 24K gold face polishes & tea tree clarifying washes",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-hair",
    name: "Hair Elixirs & Fragrance",
    slug: "hair-fragrance",
    universe: "BEAUTY_SKIN_HAIR",
    description: "Moroccan cashmere argan hair oils, amber perfume mists & leave-in silk glazes",
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-lips",
    name: "Luxe Lip Care & Velvet Rouges",
    slug: "luxe-lips",
    universe: "BEAUTY_SKIN_HAIR",
    description: "Velvet matte liquid lipsticks, 24K gold lip oils & boxed lip caskets",
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-chokers",
    name: "Bridal Chokers & Necklaces",
    slug: "chokers-necklaces",
    universe: "JEWELRY",
    description: "18K & 22K gold-plated bridal chokers, freshwater baroque pearls & royal emerald drops",
    isActive: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-earrings",
    name: "Earrings & Traditional Jhumkas",
    slug: "earrings-jhumkas",
    universe: "JEWELRY",
    description: "Handcrafted Mughal Meenakari jhumkas, chandbalis & solitaire studs",
    isActive: true,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-rings",
    name: "Rings & Solitaires",
    slug: "rings-solitaires",
    universe: "JEWELRY",
    description: "2-carat crown solitaire rings, cocktail emeralds & eternity chevron bands",
    isActive: true,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat-bangles",
    name: "Royal Kundan & Bangles",
    slug: "kundan-bangles",
    universe: "JEWELRY",
    description: "Polki diamond kara pairs, zircon tennis bracelets & pearl cuffs",
    isActive: true,
    sortOrder: 8,
    createdAt: new Date().toISOString(),
  },
];

// Default initial users
const defaultUsers: StoreUser[] = [
  {
    id: "usr-admin-1",
    name: "Veloura Atelier Admin",
    email: "admin@veloura.pk",
    phone: "+92 321 9954325",
    role: "ADMIN",
    passwordHash: "$2a$10$bkiZ5AKUsindNlxkOClbDuHI76jlKp5U6GPa/9B9CuGY.SS3ogQYa",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-admin-2",
    name: "Jiya Ahmad (Founder)",
    email: "admin@veloura.com",
    phone: "+92 321 9954325",
    role: "ADMIN",
    passwordHash: "$2a$10$bkiZ5AKUsindNlxkOClbDuHI76jlKp5U6GPa/9B9CuGY.SS3ogQYa",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-staff-1",
    name: "Zainab Raza (Order Dispatch Manager)",
    email: "zainab.staff@veloura.pk",
    phone: "+92 301 4455667",
    role: "STAFF",
    passwordHash: "$2a$10$SRTFI6QEAIyAt7BhcLaMU.gVShSowALAxKQNqm.hNmZbiLayg3M1y",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-seller-1",
    name: "Lahore Heritage Pearls & Jewels",
    email: "vendor.jewels@veloura.pk",
    phone: "+92 300 8899112",
    role: "SELLER",
    passwordHash: "$2a$10$Zpm/hOHqgBzS4dObuE7WAOKC5.zlR1uexHH7AR3DmtQVHXghr9p7K",
    sellerShopName: "Lahore Heritage Jewels & Pearls",
    sellerBio: "Handcrafted 18K & 22K gold-plated bridal jewellery, royal Kundan chokers & organic baroque pearls.",
    sellerWhatsApp: "+92 300 8899112",
    sellerInstagram: "https://instagram.com/veloura.jewels",
    sellerTikTok: "https://tiktok.com/@velourajewels",
    sellerFacebook: "https://facebook.com/velourajewels",
    sellerCity: "Lahore",
    sellerCommission: 15,
    adminProfitMargin: 15,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];

interface DBState {
  users: StoreUser[];
  products: StoreProduct[];
  categories: StoreCategory[];
}

let memoryState: DBState | null = null;

function getDbFile(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "store-db.json");
  }
  return path.join(process.cwd(), "data", "store-db.json");
}

function loadDb(): DBState {
  if (memoryState) return memoryState;

  const candidateFiles = [
    getDbFile(),
    path.join(process.cwd(), "data", "store-db.json"),
  ];

  for (const fpath of candidateFiles) {
    try {
      if (fs.existsSync(fpath)) {
        const raw = fs.readFileSync(fpath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed) {
          const cleanedProducts = (parsed.products || []).filter((p: any) => {
            const imgUrl = p.images?.[0]?.url || "";
            return !imgUrl.includes("/uploads/products/item-");
          });

          memoryState = {
            users: parsed.users && parsed.users.length > 0 ? parsed.users : defaultUsers,
            categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : defaultCategories,
            products: cleanedProducts,
          };
          return memoryState;
        }
      }
    } catch (err) {
      // Continue to next candidate
    }
  }

  // Initialize fresh without dummy products so Admin can add her own
  memoryState = {
    users: defaultUsers,
    categories: defaultCategories,
    products: [],
  };

  saveDb(memoryState);
  return memoryState;
}

function saveDb(state: DBState) {
  try {
    const targetFile = getDbFile();
    const dir = path.dirname(targetFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetFile, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("Notice: Persistent DB write skipped in serverless environment:", err);
  }
}

// ── CATEGORIES API ─────────────────────────────────────────────────────────
export async function getStoreCategories(universe?: string): Promise<StoreCategory[]> {
  const db = loadDb();
  let list = db.categories.filter((c) => c.isActive);
  if (universe && universe !== "ALL" && universe !== "DEALS") {
    list = list.filter((c) => c.universe === universe);
  }
  return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function addStoreCategory(cat: {
  name: string;
  universe: "JEWELRY" | "BEAUTY_SKIN_HAIR";
  description?: string;
  image?: string;
}): Promise<StoreCategory> {
  const db = loadDb();
  const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  const existing = db.categories.find((c) => c.slug === slug);
  if (existing) {
    return existing;
  }

  const newCat: StoreCategory = {
    id: `cat-${Date.now().toString().slice(-6)}`,
    name: cat.name.trim(),
    slug,
    universe: cat.universe,
    description: cat.description?.trim() || "",
    image: cat.image || "",
    sortOrder: db.categories.length + 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  db.categories.push(newCat);
  saveDb(db);
  return newCat;
}

export async function updateStoreCategory(id: string, updates: Partial<StoreCategory>): Promise<StoreCategory | null> {
  const db = loadDb();
  const idx = db.categories.findIndex((c) => c.id === id || c.slug === id);
  if (idx === -1) return null;

  db.categories[idx] = {
    ...db.categories[idx],
    ...updates,
    id: db.categories[idx].id,
  };
  saveDb(db);
  return db.categories[idx];
}

export async function deleteStoreCategory(id: string): Promise<boolean> {
  const db = loadDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id && c.slug !== id);
  if (db.categories.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ── PRODUCTS API ───────────────────────────────────────────────────────────
export async function getStoreProducts(filter?: {
  universe?: "JEWELRY" | "BEAUTY_SKIN_HAIR" | "DEALS" | string | null;
  subCategory?: string | null;
  categorySlug?: string | null;
  deals?: boolean;
  featured?: boolean;
  search?: string | null;
  sort?: string;
  limit?: number;
  sellerId?: string | null;
}): Promise<StoreProduct[]> {
  const db = loadDb();
  let list = db.products.filter((p) => p.isPublished);

  // Deals tab / filter: show products marked as deal OR having a sale price
  if (filter?.deals || filter?.universe === "DEALS") {
    list = list.filter((p) => p.isDeal || (p.salePrice && p.salePrice > 0 && p.salePrice < p.price));
  } else if (filter?.universe && filter.universe !== "ALL") {
    list = list.filter((p) => p.universe === filter.universe);
  }

  // Category filter
  if (filter?.categorySlug) {
    list = list.filter((p) => p.category?.slug === filter.categorySlug);
  }

  // SubCategory filter
  if (filter?.subCategory && !filter.subCategory.startsWith("All")) {
    list = list.filter((p) => p.subCategory === filter.subCategory);
  }

  if (filter?.featured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (filter?.sellerId) {
    list = list.filter((p) => p.sellerId === filter.sellerId);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filter?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filter?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Newest first
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
    const existing = db.products[prodIndex];
    const updated: StoreProduct = {
      ...existing,
      ...productData,
      id: existing.id,
      slug: productData.slug || existing.slug,
      price: Number(productData.price ?? existing.price),
      salePrice: productData.salePrice !== undefined ? (productData.salePrice ? Number(productData.salePrice) : null) : existing.salePrice,
      isDeal: productData.isDeal !== undefined ? Boolean(productData.isDeal) : existing.isDeal,
      dealBadge: productData.dealBadge || existing.dealBadge,
      images: productData.images || existing.images,
    };
    db.products[prodIndex] = updated;
    saveDb(db);
    return updated;
  } else {
    const newId = productData.id || `prod-${Date.now()}`;
    const newSlug =
      productData.slug ||
      (productData.name
        ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        : `prod-${Date.now()}`);

    // Auto calculate price if sellerBasePrice and adminProfitMargin are provided
    let finalPrice = Number(productData.price || 0);
    if (productData.sellerBasePrice && productData.adminProfitMargin) {
      const margin = Math.round(productData.sellerBasePrice * (productData.adminProfitMargin / 100));
      finalPrice = productData.sellerBasePrice + margin;
    }

    const newProduct: StoreProduct = {
      id: newId,
      name: productData.name || "Untitled Creation",
      slug: newSlug,
      description: productData.description || "",
      shortDescription:
        productData.shortDescription || (productData.description ? productData.description.slice(0, 110) + "..." : ""),
      price: finalPrice,
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      isDeal: Boolean(productData.isDeal),
      dealBadge: productData.dealBadge || (productData.isDeal ? "SPECIAL DEAL" : undefined),
      sku: productData.sku || `VEL-NEW-${Date.now().toString().slice(-4)}`,
      category: productData.category || {
        id: "cat-skincare",
        name: "Silk Skincare & Serums",
        slug: "silk-skincare",
      },
      universe: productData.universe || "BEAUTY_SKIN_HAIR",
      subCategory: productData.subCategory || "Facewash & Cleansers",
      brand: productData.brand || "VELOURA Haute Atelier",
      stock: Number(productData.stock ?? 15),
      isPublished: productData.isPublished !== undefined ? Boolean(productData.isPublished) : true,
      isFeatured: Boolean(productData.isFeatured),
      tags: productData.tags || [],
      images:
        productData.images && productData.images.length > 0
          ? productData.images
          : [],
      sellerId: productData.sellerId || "usr-admin-1",
      sellerName: productData.sellerName || "Veloura Atelier Admin",
      sellerShopName: productData.sellerShopName || "Veloura Haute Atelier",
      sellerBasePrice: productData.sellerBasePrice,
      adminProfitMargin: productData.adminProfitMargin || 15,
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
  db.products = db.products.filter((p) => p.id !== id && p.slug !== id);
  if (db.products.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// ── USER / SELLER PROFILE API ──────────────────────────────────────────────
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
  adminProfitMargin?: number;
}): Promise<StoreUser> {
  const db = loadDb();
  const cleanEmail = userData.email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error("User with this email already exists in Atelier");
  }

  const rawPassword = userData.password || "welcome123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);
  const margin =
    userData.adminProfitMargin !== undefined
      ? Number(userData.adminProfitMargin)
      : userData.sellerCommission !== undefined
      ? Number(userData.sellerCommission)
      : 15;

  const newUser: StoreUser = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: userData.name.trim(),
    email: cleanEmail,
    phone: userData.phone?.trim() || "",
    role: userData.role,
    passwordHash,
    sellerShopName:
      userData.sellerShopName?.trim() || (userData.role === "SELLER" ? `${userData.name}'s Shop` : undefined),
    sellerCommission: margin,
    adminProfitMargin: margin,
    sellerCity: "Lahore",
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

export async function updateSellerProfile(
  userId: string,
  profile: {
    sellerShopName?: string;
    sellerBio?: string;
    sellerWhatsApp?: string;
    sellerInstagram?: string;
    sellerTikTok?: string;
    sellerFacebook?: string;
    sellerCity?: string;
    phone?: string;
    name?: string;
  }
): Promise<StoreUser | null> {
  const db = loadDb();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  db.users[idx] = {
    ...db.users[idx],
    ...profile,
  };

  if (profile.sellerShopName) {
    db.products.forEach((p) => {
      if (p.sellerId === userId) {
        p.sellerShopName = profile.sellerShopName;
      }
    });
  }

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
  if (db.products) {
    db.products.forEach((p) => {
      if (p.sellerId === id) {
        p.isPublished = false;
      }
    });
  }
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

export async function findUserById(id: string): Promise<StoreUser | null> {
  const db = loadDb();
  return db.users.find((u) => u.id === id) || null;
}
