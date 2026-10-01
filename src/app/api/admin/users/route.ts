import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getStoreUsers, addStoreUser, updateStoreUser, deleteStoreUser } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await getStoreUsers();
    // Return sanitized users without password hash
    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      status: u.status,
      sellerShopName: u.sellerShopName,
      sellerCommission: u.sellerCommission,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, password, role, sellerShopName, sellerCommission } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "STAFF", "SELLER", "CUSTOMER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const newUser = await addStoreUser({
      name,
      email,
      phone,
      password: password || "veloura123",
      role,
      sellerShopName,
      sellerCommission: sellerCommission ? Number(sellerCommission) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `${role} account created successfully!`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        sellerShopName: newUser.sellerShopName,
        sellerCommission: newUser.sellerCommission,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Admin user POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, role } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updated = await updateStoreUser(id, {
      ...(status && { status }),
      ...(role && { role }),
    });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (error: any) {
    console.error("Admin user PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
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
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await deleteStoreUser(id);
    return NextResponse.json({ success: true, message: "User removed successfully" });
  } catch (error: any) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 400 });
  }
}
