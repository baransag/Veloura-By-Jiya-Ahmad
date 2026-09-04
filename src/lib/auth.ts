import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "veloura_default_jwt_secret_key_luxury";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  name?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getCustomerSession(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("veloura_customer_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (payload && payload.role === "CUSTOMER") {
    return payload;
  }
  return null;
}

export function getAdminSession(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("veloura_admin_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (payload && payload.role === "ADMIN") {
    return payload;
  }
  return null;
}
