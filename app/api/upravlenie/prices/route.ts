import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"
import { rooms as defaultRooms } from "@/lib/rooms"
import { getRoomPrices } from "@/lib/prices"

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const prices = await getRoomPrices()
  const items = defaultRooms.map((r) => ({
    slug: r.slug,
    name: r.name,
    price: prices[r.slug] ?? r.price,
    defaultPrice: r.price,
  }))
  return NextResponse.json({ prices: items })
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { prices?: Record<string, number> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const updates = body.prices ?? {}
  const validSlugs = new Set(defaultRooms.map((r) => r.slug))

  for (const [slug, price] of Object.entries(updates)) {
    if (!validSlugs.has(slug)) continue
    const num = Math.round(Number(price))
    if (!Number.isFinite(num) || num < 0 || num > 1_000_000) {
      return NextResponse.json(
        { error: `Некорректная цена для ${slug}` },
        { status: 400 }
      )
    }
    await db
      .insert(schema.roomPrices)
      .values({ slug, price: num })
      .onConflictDoUpdate({
        target: schema.roomPrices.slug,
        set: { price: num, updatedAt: sql`(unixepoch())` },
      })
  }

  const next = await getRoomPrices()
  return NextResponse.json({ ok: true, prices: next })
}
