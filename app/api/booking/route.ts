import { NextResponse } from "next/server"
import { db, schema } from "@/lib/db"
import { calculateBooking, formatRub } from "@/lib/rooms"
import { getRoomPrices } from "@/lib/prices"

type BookingPayload = {
  name?: string
  phone?: string
  email?: string
  checkin?: string
  checkout?: string
  room?: string
  guests?: string
  message?: string
}

const ROOM_LABELS: Record<string, string> = {
  "standard-2": "«Стандарт» 2х-местный (2 500 ₽)",
  "standard-3": "«Стандарт» 3х-местный (3 000 ₽)",
  "standard-4": "«Стандарт» 4х-местный (4 000 ₽)",
}

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
}

export async function POST(request: Request) {
  let data: BookingPayload
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const { name, phone, checkin, checkout, room, guests, email, message } = data

  if (!name || !phone || !checkin || !checkout || !room || !guests) {
    return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 })
  }

  let savedId: number | null = null
  try {
    const [saved] = await db
      .insert(schema.bookings)
      .values({
        name: name!,
        phone: phone!,
        email: email || null,
        checkin: checkin!,
        checkout: checkout!,
        room: room!,
        guests: guests!,
        message: message || null,
      })
      .returning({ id: schema.bookings.id })
    savedId = saved?.id ?? null
  } catch (err) {
    console.error("Failed to save booking to DB:", err)
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set — заявка сохранена в БД, но не отправлена в Telegram")
    return NextResponse.json({ ok: true, savedId })
  }

  const adminUrl = process.env.ADMIN_BASE_URL
  const adminLink = savedId && adminUrl ? `${adminUrl.replace(/\/$/, "")}/admin#booking-${savedId}` : null
  const prices = await getRoomPrices()
  const pricing = calculateBooking(room!, checkin!, checkout!, prices[room!])
  const nightsLabel = (n: number) => {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return "ночь"
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "ночи"
    return "ночей"
  }

  const lines = [
    "🛎 <b>Новая заявка на бронирование</b>",
    "",
    `👤 <b>Имя:</b> ${escape(name)}`,
    `📞 <b>Телефон:</b> ${escape(phone)}`,
    email ? `✉️ <b>Email:</b> ${escape(email)}` : null,
    "",
    `🏠 <b>Номер:</b> ${escape(ROOM_LABELS[room] ?? room)}`,
    `👥 <b>Гостей:</b> ${escape(guests)}`,
    `📅 <b>Заезд:</b> ${escape(formatDate(checkin))}`,
    `📅 <b>Выезд:</b> ${escape(formatDate(checkout))}`,
    pricing.nights > 0
      ? `🌙 <b>Срок:</b> ${pricing.nights} ${nightsLabel(pricing.nights)} × ${formatRub(pricing.pricePerNight)}`
      : null,
    pricing.total > 0 ? `💰 <b>Итого:</b> <b>${formatRub(pricing.total)}</b>` : null,
    message ? "" : null,
    message ? `💬 <b>Пожелания:</b>\n${escape(message)}` : null,
    adminLink ? "" : null,
    adminLink ? `🔗 <a href="${adminLink}">Открыть в админке</a>` : null,
  ].filter(Boolean)

  const text = lines.join("\n")

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    if (!tgResponse.ok) {
      const errorBody = await tgResponse.text()
      console.error("Telegram API error:", tgResponse.status, errorBody)
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Позвоните нам, пожалуйста." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Booking submit failed:", err)
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Позвоните нам, пожалуйста." },
      { status: 500 }
    )
  }
}

