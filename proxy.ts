import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_COOKIE_NAME = "vostok_admin"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/upravlenie") && !pathname.startsWith("/api/upravlenie")) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === "/upravlenie/login"
  const isLoginApi = pathname === "/api/upravlenie/login"
  if (isLoginPage || isLoginApi) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (token) return NextResponse.next()

  if (pathname.startsWith("/api/upravlenie")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const url = request.nextUrl.clone()
  url.pathname = "/upravlenie/login"
  url.searchParams.set("from", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/upravlenie/:path*", "/api/upravlenie/:path*"],
}
