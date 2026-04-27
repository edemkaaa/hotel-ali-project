import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "vostok_admin"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("ADMIN_SECRET or ADMIN_PASSWORD env var is required")
  }
  return secret
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

function makeToken(): string {
  const issued = Date.now().toString()
  const sig = sign(issued)
  return `${issued}.${sig}`
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  const [issued, sig] = token.split(".")
  if (!issued || !sig) return false
  const expected = sign(issued)
  try {
    if (sig.length !== expected.length) return false
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false
  } catch {
    return false
  }
  const ageMs = Date.now() - Number(issued)
  if (Number.isNaN(ageMs) || ageMs < 0 || ageMs > COOKIE_MAX_AGE * 1000) return false
  return true
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  if (password.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function createSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifyToken(token)
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME
