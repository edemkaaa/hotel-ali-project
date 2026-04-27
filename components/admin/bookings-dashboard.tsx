"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Loader2,
  Inbox,
  Phone,
  Mail,
  Calendar,
  Users,
  Bed,
  MessageSquare,
  Trash2,
  Check,
  X,
  Archive,
  Download,
  LogOut,
  Calendar as CalendarIcon,
  Tag,
} from "lucide-react"
import { CalendarView } from "@/components/admin/calendar-view"
import { PricesEditor } from "@/components/admin/prices-editor"
import { rooms as roomsConfig } from "@/lib/rooms"

type BookingStatus = "new" | "confirmed" | "declined" | "archived"

type Booking = {
  id: number
  name: string
  phone: string
  email: string | null
  checkin: string
  checkout: string
  room: string
  guests: string
  message: string | null
  status: BookingStatus
  notes: string | null
  createdAt: string | number
  updatedAt: string | number
}

const ROOM_LABELS: Record<string, string> = {
  "standard-2": "2х-местный",
  "standard-3": "3х-местный",
  "standard-4": "4х-местный",
}

const FILTERS: { value: BookingStatus | ""; label: string }[] = [
  { value: "", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "confirmed", label: "Подтверждённые" },
  { value: "declined", label: "Отклонённые" },
  { value: "archived", label: "Архив" },
]

const STATUS_COLORS: Record<BookingStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  archived: "bg-zinc-100 text-zinc-600",
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  declined: "Отклонена",
  archived: "Архив",
}

function formatDate(input: string | number) {
  const d = typeof input === "number" ? new Date(input * 1000) : new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDay(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })
}

type Tab = "list" | "calendar" | "prices"

export function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<Tab>("list")

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/upravlenie/bookings`, { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setBookings(data.bookings ?? [])
    } catch (err) {
      console.error(err)
      setError("Не удалось загрузить заявки")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const availability = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMs = today.getTime()

    return roomsConfig.map((room) => {
      const occupiedConfirmed = bookings.filter((b) => {
        if (b.status !== "confirmed") return false
        if (b.room !== room.slug) return false
        const ci = new Date(b.checkin).getTime()
        const co = new Date(b.checkout).getTime()
        return !Number.isNaN(ci) && !Number.isNaN(co) && ci <= todayMs && co > todayMs
      }).length

      const occupiedPending = bookings.filter((b) => {
        if (b.status !== "new") return false
        if (b.room !== room.slug) return false
        const ci = new Date(b.checkin).getTime()
        const co = new Date(b.checkout).getTime()
        return !Number.isNaN(ci) && !Number.isNaN(co) && ci <= todayMs && co > todayMs
      }).length

      return {
        slug: room.slug,
        shortName: room.shortName,
        total: room.totalRooms,
        occupied: occupiedConfirmed,
        pending: occupiedPending,
        free: Math.max(0, room.totalRooms - occupiedConfirmed),
      }
    })
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase()
    return bookings.filter((b) => {
      if (statusFilter && b.status !== statusFilter) return false
      if (term) {
        const hay = `${b.name} ${b.phone} ${b.email ?? ""}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
  }, [bookings, statusFilter, search])

  async function updateBooking(id: number, patch: Partial<Pick<Booking, "status" | "notes">>) {
    const res = await fetch(`/api/upravlenie/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      alert("Не удалось обновить заявку")
      return
    }
    const data = await res.json()
    setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)))
  }

  async function deleteBooking(id: number) {
    if (!confirm("Удалить заявку безвозвратно?")) return
    const res = await fetch(`/api/upravlenie/bookings/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Не удалось удалить")
      return
    }
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  async function logout() {
    await fetch("/api/upravlenie/logout", { method: "POST" })
    window.location.href = "/upravlenie/login"
  }

  const counts = useMemo(() => {
    const c: Record<BookingStatus | "all", number> = {
      all: bookings.length,
      new: 0,
      confirmed: 0,
      declined: 0,
      archived: 0,
    }
    bookings.forEach((b) => {
      c[b.status] = (c[b.status] ?? 0) + 1
    })
    return c
  }, [bookings])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">Восток · Админка</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Всего заявок: {counts.all}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/upravlenie/bookings/export"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <Download className="h-4 w-4" /> CSV
            </a>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Выйти
            </Button>
          </div>
        </div>
        <nav className="container mx-auto px-4 flex gap-1 -mb-px">
          {[
            { id: "list" as Tab, label: "Заявки", icon: Inbox },
            { id: "calendar" as Tab, label: "Календарь", icon: CalendarIcon },
            { id: "prices" as Tab, label: "Цены", icon: Tag },
          ].map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition ${
                  active
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-6">
        {tab === "list" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {availability.map((a) => {
                const fullyBooked = a.free === 0
                return (
                  <div
                    key={a.slug}
                    className={`rounded-2xl border p-4 ${
                      fullyBooked
                        ? "bg-red-50 border-red-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      <Bed className="h-3.5 w-3.5" />
                      {a.shortName}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold ${
                          fullyBooked ? "text-red-700" : "text-emerald-700"
                        }`}
                      >
                        {a.free}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        из {a.total} свободно
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Сегодня заселено: {a.occupied}
                      {a.pending > 0 && (
                        <span className="ml-2 text-amber-600">
                          + {a.pending} ожидают подтверждения
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const active = statusFilter === f.value
                  const count = f.value === "" ? counts.all : counts[f.value]
                  return (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`px-3.5 py-1.5 rounded-full text-sm transition ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {f.label}
                      <span className={`ml-2 text-xs ${active ? "opacity-80" : "opacity-60"}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="md:ml-auto relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени, телефону, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>
            </div>

            {loading && bookings.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Загрузка...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-6 py-8 text-center">
                {error}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Inbox className="h-12 w-12 mb-3 opacity-40" />
                <p className="text-lg font-medium">
                  {bookings.length === 0 ? "Заявок пока нет" : "Нет заявок по этому фильтру"}
                </p>
                <p className="text-sm">
                  {bookings.length === 0
                    ? "Когда гости заполнят форму, они появятся здесь."
                    : "Попробуйте сменить фильтр или поиск."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onUpdate={updateBooking}
                    onDelete={deleteBooking}
                  />
                ))}
              </div>
            )}

            {filteredBookings.length > 0 && (
              <div className="mt-8 text-center text-xs text-muted-foreground">
                Показано {filteredBookings.length} {filteredBookings.length === 1 ? "заявка" : "заявок"}
                {statusFilter && ` (фильтр: ${FILTERS.find((f) => f.value === statusFilter)?.label})`}
              </div>
            )}
          </div>
        )}

        {tab === "calendar" && <CalendarView bookings={bookings as never} />}
        {tab === "prices" && <PricesEditor />}
      </main>
    </div>
  )
}

function BookingCard({
  booking,
  onUpdate,
  onDelete,
}: {
  booking: Booking
  onUpdate: (id: number, patch: Partial<Pick<Booking, "status" | "notes">>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [notes, setNotes] = useState(booking.notes ?? "")
  const [savingNotes, setSavingNotes] = useState(false)

  async function saveNotes() {
    if (notes === (booking.notes ?? "")) return
    setSavingNotes(true)
    await onUpdate(booking.id, { notes })
    setSavingNotes(false)
  }

  return (
    <article
      id={`booking-${booking.id}`}
      className="bg-card rounded-2xl border shadow-sm p-5 md:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-foreground">{booking.name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status]}`}
            >
              {STATUS_LABELS[booking.status]}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              #{booking.id} · {formatDate(booking.createdAt)}
            </span>
          </div>

          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field icon={Phone} label="Телефон">
              <a href={`tel:${booking.phone}`} className="hover:underline">
                {booking.phone}
              </a>
            </Field>
            {booking.email && (
              <Field icon={Mail} label="Email">
                <a href={`mailto:${booking.email}`} className="hover:underline">
                  {booking.email}
                </a>
              </Field>
            )}
            <Field icon={Bed} label="Номер">
              {ROOM_LABELS[booking.room] ?? booking.room}
            </Field>
            <Field icon={Users} label="Гостей">
              {booking.guests}
            </Field>
            <Field icon={Calendar} label="Заезд">
              {formatDay(booking.checkin)}
            </Field>
            <Field icon={Calendar} label="Выезд">
              {formatDay(booking.checkout)}
            </Field>
          </dl>

          {booking.message && (
            <div className="mt-4 flex gap-2 text-sm bg-muted/50 rounded-xl p-3">
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <p className="text-foreground/80 whitespace-pre-wrap">{booking.message}</p>
            </div>
          )}

          <div className="mt-4">
            <label className="text-xs text-muted-foreground">Внутренние заметки</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={2}
              placeholder="Только для админа..."
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            {savingNotes && <span className="text-xs text-muted-foreground">Сохранение...</span>}
          </div>
        </div>

        <div className="flex md:flex-col gap-2 md:w-44">
          {booking.status !== "confirmed" && (
            <Button
              size="sm"
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onUpdate(booking.id, { status: "confirmed" })}
            >
              <Check className="h-4 w-4 mr-1" /> Подтвердить
            </Button>
          )}
          {booking.status !== "declined" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => onUpdate(booking.id, { status: "declined" })}
            >
              <X className="h-4 w-4 mr-1" /> Отклонить
            </Button>
          )}
          {booking.status !== "archived" && (
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 md:flex-none"
              onClick={() => onUpdate(booking.id, { status: "archived" })}
            >
              <Archive className="h-4 w-4 mr-1" /> В архив
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(booking.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Удалить
          </Button>
        </div>
      </div>
    </article>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-foreground truncate">{children}</div>
      </div>
    </div>
  )
}
