import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getStoreCategories,
  addStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
} from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const universe = searchParams.get("universe") || undefined;
    const categories = await getStoreCategories(universe);

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, universe, description, image } = body;

    if (!name || !universe) {
      return NextResponse.json({ error: "Category name and wing/universe are required" }, { status: 400 });
    }

    const newCategory = await addStoreCategory({
      name: name.trim(),
      universe: universe === "JEWELRY" ? "JEWELRY" : "BEAUTY_SKIN_HAIR",
      description: description?.trim() || "",
      image: image || "",
    });

    return NextResponse.json({
      success: true,
      message: `Category "${newCategory.name}" created successfully!`,
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Admin category POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, universe, description, image, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    const updated = await updateStoreCategory(id, {
      ...(name && { name: name.trim() }),
      ...(universe && { universe }),
      ...(description !== undefined && { description: description.trim() }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error: any) {
    console.error("Admin category PATCH error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    const success = await deleteStoreCategory(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("Admin category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
