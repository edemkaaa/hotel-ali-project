import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { BookingsDashboard } from "@/components/admin/bookings-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/upravlenie/login")
  }
  return <BookingsDashboard />
}
