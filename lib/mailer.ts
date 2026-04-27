import nodemailer from "nodemailer"

type BookingEmailInput = {
  name: string
  phone: string
  email?: string | null
  room: string
  roomLabel: string
  guests: string
  checkin: string
  checkoutLabel: string
  checkinLabel: string
  checkout: string
  message?: string | null
  pricePerNight: number
  nights: number
  total: number
  bookingId: number | null
  adminLink: string | null
}

let cachedTransport: nodemailer.Transporter | null = null

function getTransport() {
  if (cachedTransport) return cachedTransport
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return cachedTransport
}

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽"
}

export async function sendBookingEmail(input: BookingEmailInput) {
  const transport = getTransport()
  const to = process.env.BOOKING_NOTIFY_EMAIL
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!transport || !to || !from) return

  const fields: Array<[string, string]> = [
    ["Имя", input.name],
    ["Телефон", input.phone],
  ]
  if (input.email) fields.push(["Email гостя", input.email])
  fields.push(
    ["Номер", input.roomLabel],
    ["Гостей", input.guests],
    ["Заезд", input.checkinLabel],
    ["Выезд", input.checkoutLabel],
  )
  if (input.nights > 0) {
    fields.push(["Срок", `${input.nights} ноч. × ${formatRub(input.pricePerNight)}`])
    fields.push(["Итого", formatRub(input.total)])
  }
  if (input.message) fields.push(["Пожелания", input.message])

  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#6b7280;white-space:nowrap;vertical-align:top;">${escape(
          k,
        )}</td><td style="padding:6px 12px;color:#111827;font-weight:500;">${escape(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")

  const html = `<!doctype html>
<html lang="ru"><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 4px;font-size:20px;color:#111827;">🛎 Новая заявка на бронирование</h1>
    <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">Гостевой дом «Восток»${
      input.bookingId ? ` · #${input.bookingId}` : ""
    }</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">${rows}</table>
    ${
      input.adminLink
        ? `<p style="margin:20px 0 0;text-align:center;"><a href="${escape(
            input.adminLink,
          )}" style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:9999px;font-weight:500;">Открыть в админке</a></p>`
        : ""
    }
    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;text-align:center;">Письмо отправлено автоматически с gostevoydomvostok.ru</p>
  </div>
</body></html>`

  const text = [
    "🛎 Новая заявка на бронирование",
    ...fields.map(([k, v]) => `${k}: ${v}`),
    input.adminLink ? `\nАдминка: ${input.adminLink}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  await transport.sendMail({
    from: `"Гостевой дом «Восток»" <${from}>`,
    to,
    subject: `🛎 Новая заявка${input.bookingId ? ` #${input.bookingId}` : ""} — ${input.name}`,
    text,
    html,
  })
}
