import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"

const STATUS_RU: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  declined: "Отклонена",
  archived: "Архив",
}

const ROOM_RU: Record<string, string> = {
  "standard-2": "2-местный",
  "standard-3": "3-местный",
  "standard-4": "4-местный",
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ""
  const s = String(value).replace(/"/g, '""')
  return `"${s}"`
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db
    .select()
    .from(schema.bookings)
    .orderBy(desc(schema.bookings.createdAt))

  const header = [
    "ID",
    "Создана",
    "Статус",
    "Имя",
    "Телефон",
    "Email",
    "Заезд",
    "Выезд",
    "Номер",
    "Гостей",
    "Пожелания",
    "Заметки",
  ]

  const lines = [header.map(csvEscape).join(",")]

  for (const r of rows) {
    lines.push(
      [
        r.id,
        new Date(r.createdAt).toLocaleString("ru-RU"),
        STATUS_RU[r.status] ?? r.status,
        r.name,
        r.phone,
        r.email ?? "",
        r.checkin,
        r.checkout,
        ROOM_RU[r.room] ?? r.room,
        r.guests,
        r.message ?? "",
        r.notes ?? "",
      ].map(csvEscape).join(",")
    )
  }

  const csv = "﻿" + lines.join("\n")
  const filename = `bookings-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
