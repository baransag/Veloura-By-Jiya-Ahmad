import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { getVelouraProducts, CatalogItem } from "./catalog-data";

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
    name: "Lahore Heritage Pearls & Jewels",
    email: "vendor.jewels@veloura.pk",
    phone: "+92 300 8899112",
    role: "SELLER",
    passwordHash: bcrypt.hashSync("seller123", 10),
    sellerShopName: "Lahore Heritage Jewels & Pearls",
    sellerBio: "Handcrafted 18K & 22K gold-plated bridal jewellery, royal Kundan chokers & organic baroque pearls inspired by old Lahore craftsmanship.",
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
  {
    id: "usr-seller-2",
    name: "Pure Silk Botanicals Pakistan",
    email: "vendor.botanicals@veloura.pk",
    phone: "+92 321 4455889",
    role: "SELLER",
    passwordHash: bcrypt.hashSync("seller123", 10),
    sellerShopName: "Silk Botanicals Atelier",
    sellerBio: "Organic steam-distilled Damask rose facewashes, pure silk peptide glass skin serums, and cold-pressed Moroccan argan hair oils.",
    sellerWhatsApp: "+92 321 4455889",
    sellerInstagram: "https://instagram.com/veloura.botanicals",
    sellerTikTok: "https://tiktok.com/@velourabotanicals",
    sellerFacebook: "https://facebook.com/velourabotanicals",
    sellerCity: "Karachi",
    sellerCommission: 15,
    adminProfitMargin: 15,
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
        // Filter out any non-Veloura or deleted item references
        const validProducts = parsed.products.filter((p: any) => {
          const imgUrl = p.images?.[0]?.url || "";
          const match = imgUrl.match(/item-(\d+)\.jpeg/);
          if (match && parseInt(match[1]) > 86) return false;
          return true;
        });
        if (validProducts.length > 0) {
          memoryState = { ...parsed, products: validProducts };
          return memoryState!;
        }
      }
    }
  } catch (err) {
    console.error("Error reading store db file, re-initializing:", err);
  }

  // Initialize fresh with pure authentic Veloura creations
  memoryState = {
    users: defaultUsers,
    products: getVelouraProducts(),
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
  universe?: "JEWELRY" | "BEAUTY_SKIN_HAIR" | string | null;
  subCategory?: string | null;
  categorySlug?: string | null;
  featured?: boolean;
  search?: string | null;
  sort?: string;
  limit?: number;
  sellerId?: string | null;
}): Promise<StoreProduct[]> {
  const db = loadDb();
  let list = db.products.filter((p) => p.isPublished);

  // Universe filter: "JEWELRY" vs "BEAUTY_SKIN_HAIR"
  if (filter?.universe && filter.universe !== "ALL") {
    list = list.filter((p) => p.universe === filter.universe);
  }

  // SubCategory filter: "Facewash & Cleansers", "Chokers & Necklaces", etc.
  if (filter?.subCategory && !filter.subCategory.startsWith("All")) {
    list = list.filter((p) => p.subCategory === filter.subCategory);
  }

  if (filter?.categorySlug) {
    list = list.filter((p) => p.category.slug === filter.categorySlug);
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
        p.subCategory.toLowerCase().includes(q) ||
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
    const newId = productData.id || `prod-${Date.now()}`;
    const newSlug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `prod-${Date.now()}`);
    
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
      shortDescription: productData.shortDescription || (productData.description ? productData.description.slice(0, 110) + "..." : ""),
      price: finalPrice,
      salePrice: productData.salePrice ? Number(productData.salePrice) : null,
      sku: productData.sku || `VEL-NEW-${Date.now().toString().slice(-4)}`,
      category: productData.category || { id: "cat-1", name: "Luxe Makeup & Lips", slug: "luxe-makeup" },
      universe: productData.universe || "BEAUTY_SKIN_HAIR",
      subCategory: productData.subCategory || "Facewash & Cleansers",
      brand: productData.brand || "VELOURA Haute Atelier",
      stock: Number(productData.stock ?? 15),
      isPublished: productData.isPublished !== undefined ? Boolean(productData.isPublished) : true,
      isFeatured: Boolean(productData.isFeatured),
      tags: productData.tags || [],
      images: productData.images || [{ id: `${newId}-1`, url: "/uploads/products/item-01.jpeg", isPrimary: true }],
      sellerId: productData.sellerId || "usr-admin-1",
      sellerName: productData.sellerName || "Veloura Atelier Admin",
      sellerShopName: productData.sellerShopName || "Veloura Official",
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
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// User / Vendor management functions
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
  const margin = userData.adminProfitMargin !== undefined ? Number(userData.adminProfitMargin) : (userData.sellerCommission !== undefined ? Number(userData.sellerCommission) : 15);

  const newUser: StoreUser = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: userData.name.trim(),
    email: cleanEmail,
    phone: userData.phone?.trim() || "",
    role: userData.role,
    passwordHash,
    sellerShopName: userData.sellerShopName?.trim() || (userData.role === "SELLER" ? `${userData.name}'s Shop` : undefined),
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

  // Also update existing products with the new shop name
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
    // If seller deleted, unpublish their products
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
