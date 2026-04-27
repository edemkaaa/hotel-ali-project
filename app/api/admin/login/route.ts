import { NextResponse } from "next/server"
import { checkPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const password = body.password ?? ""
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 })
  }

  await createSession()
  return NextResponse.json({ ok: true })
}
