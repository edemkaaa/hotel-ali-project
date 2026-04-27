import { NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"

const VALID_STATUSES = new Set(["new", "confirmed", "declined", "archived"])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 })
  }

  let body: { status?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const updates: Partial<typeof schema.bookings.$inferInsert> = {
    updatedAt: new Date(),
  }
  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    updates.status = body.status as typeof schema.bookings.$inferInsert["status"]
  }
  if (body.notes !== undefined) {
    updates.notes = body.notes
  }

  const [updated] = await db
    .update(schema.bookings)
    .set(updates)
    .where(eq(schema.bookings.id, numericId))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ booking: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 })
  }
  await db.delete(schema.bookings).where(eq(schema.bookings.id, numericId))
  return NextResponse.json({ ok: true })
}
