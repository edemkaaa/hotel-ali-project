import { NextResponse } from "next/server"
import { and, desc, like, or } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get("status")
  const search = url.searchParams.get("q")?.trim()

  const conditions = []
  if (status && ["new", "confirmed", "declined", "archived"].includes(status)) {
    conditions.push(like(schema.bookings.status, status))
  }
  if (search) {
    const term = `%${search}%`
    conditions.push(
      or(
        like(schema.bookings.name, term),
        like(schema.bookings.phone, term),
        like(schema.bookings.email, term),
      )!
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const rows = await db
    .select()
    .from(schema.bookings)
    .where(where)
    .orderBy(desc(schema.bookings.createdAt))
    .limit(500)

  return NextResponse.json({ bookings: rows })
}
