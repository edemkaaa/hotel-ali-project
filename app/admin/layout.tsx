import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Админка — Восток",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-secondary/30">{children}</div>
}
