"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Phone, BedDouble } from "lucide-react"
import { Button } from "@/components/ui/button"

type Booking = {
  id: number
  name: string
  phone: string
  checkin: string
  checkout: string
  room: string
  guests: string
  status: "new" | "confirmed" | "declined" | "archived"
}

const ROOM_LABEL: Record<string, string> = {
  "standard-2": "2-местный",
  "standard-3": "3-местный",
  "standard-4": "4-местный",
}

const ROOM_SHORT: Record<string, string> = {
  "standard-2": "2м",
  "standard-3": "3м",
  "standard-4": "4м",
}

const STATUS_COLOR: Record<string, string> = {
  new: "bg-sky-500",
  confirmed: "bg-emerald-500",
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
]

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function parseGuests(g: string): number {
  if (g === "5+") return 5
  const n = Number(g)
  return Number.isFinite(n) ? n : 0
}

function bookingActiveOn(b: Booking, day: Date): boolean {
  const inDay = startOfDay(new Date(b.checkin))
  const outDay = startOfDay(new Date(b.checkout))
  const d = startOfDay(day)
  return d >= inDay && d < outDay
}

function bookingStartsOn(b: Booking, day: Date): boolean {
  return ymd(startOfDay(new Date(b.checkin))) === ymd(day)
}

function bookingEndsOn(b: Booking, day: Date): boolean {
  return ymd(startOfDay(new Date(b.checkout))) === ymd(day)
}

export function CalendarView({ bookings }: { bookings: Booking[] }) {
  const today = startOfDay(new Date())
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date>(today)

  const active = useMemo(
    () => bookings.filter((b) => b.status === "new" || b.status === "confirmed"),
    [bookings]
  )

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const lastOfMonth = new Date(year, month + 1, 0)
    // weekday: 0=Sun..6=Sat → convert to Mon-first
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7
    const totalCells = Math.ceil((firstWeekday + lastOfMonth.getDate()) / 7) * 7
    const result: Date[] = []
    const start = new Date(firstOfMonth)
    start.setDate(start.getDate() - firstWeekday)
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      result.push(d)
    }
    return result
  }, [cursor])

  const dayStats = useMemo(() => {
    const map = new Map<
      string,
      { guests: number; arrivals: number; departures: number; byRoom: Record<string, number> }
    >()
    for (const day of days) {
      const key = ymd(day)
      const stat = { guests: 0, arrivals: 0, departures: 0, byRoom: {} as Record<string, number> }
      for (const b of active) {
        if (bookingActiveOn(b, day)) {
          stat.guests += parseGuests(b.guests)
          stat.byRoom[b.room] = (stat.byRoom[b.room] ?? 0) + 1
        }
        if (bookingStartsOn(b, day)) stat.arrivals++
        if (bookingEndsOn(b, day)) stat.departures++
      }
      map.set(key, stat)
    }
    return map
  }, [days, active])

  const selectedBookings = useMemo(() => {
    return active
      .filter((b) => bookingActiveOn(b, selected) || bookingStartsOn(b, selected) || bookingEndsOn(b, selected))
      .sort((a, b) => a.checkin.localeCompare(b.checkin))
  }, [active, selected])

  const monthStats = useMemo(() => {
    let arrivals = 0
    let totalGuestNights = 0
    for (const day of days) {
      const inMonth = day.getMonth() === cursor.getMonth()
      if (!inMonth) continue
      const stat = dayStats.get(ymd(day))!
      arrivals += stat.arrivals
      totalGuestNights += stat.guests
    }
    return { arrivals, totalGuestNights }
  }, [days, cursor, dayStats])

  function shiftMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground min-w-[180px] text-center">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </h2>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => shiftMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => {
                const t = startOfDay(new Date())
                setCursor(new Date(t.getFullYear(), t.getMonth(), 1))
                setSelected(t)
              }}
            >
              Сегодня
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Новая
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Подтверждена
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground bg-secondary/30 border-b border-border/50">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = ymd(day)
            const stat = dayStats.get(key)!
            const inMonth = day.getMonth() === cursor.getMonth()
            const isToday = ymd(day) === ymd(today)
            const isSelected = ymd(day) === ymd(selected)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6
            const hasActivity = stat.guests > 0 || stat.arrivals > 0 || stat.departures > 0

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={`min-h-[88px] p-2 text-left border-b border-r border-border/40 transition-colors flex flex-col gap-1.5 ${
                  inMonth ? "bg-card" : "bg-secondary/20 text-muted-foreground/50"
                } ${isSelected ? "ring-2 ring-primary ring-inset" : ""} ${
                  isWeekend && inMonth ? "bg-amber-50/30" : ""
                } hover:bg-secondary/30`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {hasActivity && stat.guests > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                      <Users className="h-3 w-3" />
                      {stat.guests}
                    </span>
                  )}
                </div>

                {inMonth && (
                  <div className="flex flex-wrap gap-0.5 mt-auto">
                    {Object.entries(stat.byRoom).map(([room, count]) => (
                      <span
                        key={room}
                        className="inline-flex items-center gap-0.5 text-[9px] font-medium bg-emerald-100 text-emerald-700 rounded px-1 py-0.5"
                        title={`${ROOM_LABEL[room] ?? room}: ${count}`}
                      >
                        {ROOM_SHORT[room] ?? room}·{count}
                      </span>
                    ))}
                  </div>
                )}

                {inMonth && (stat.arrivals > 0 || stat.departures > 0) && (
                  <div className="flex gap-1 text-[9px] text-muted-foreground">
                    {stat.arrivals > 0 && <span className="text-emerald-700">↑{stat.arrivals}</span>}
                    {stat.departures > 0 && <span className="text-red-600">↓{stat.departures}</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="px-5 py-3 border-t border-border/50 bg-secondary/20 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>За {MONTHS[cursor.getMonth()].toLowerCase()}: {monthStats.arrivals} заездов · {monthStats.totalGuestNights} гостей-ночей</span>
          <span className="flex items-center gap-3">
            <span>↑ заезды</span>
            <span>↓ выезды</span>
          </span>
        </div>
      </div>

      {/* Selected day details */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            {selected.toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
        </div>

        {selectedBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            На этот день заявок нет
          </p>
        ) : (
          <div className="space-y-2">
            {selectedBookings.map((b) => {
              const isArrival = bookingStartsOn(b, selected)
              const isDeparture = bookingEndsOn(b, selected)
              const tag = isArrival
                ? { label: "Заезд", classes: "bg-emerald-100 text-emerald-700" }
                : isDeparture
                ? { label: "Выезд", classes: "bg-red-100 text-red-700" }
                : { label: "Проживает", classes: "bg-sky-100 text-sky-700" }
              return (
                <a
                  key={b.id}
                  href={`#booking-${b.id}`}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-border/50 hover:bg-secondary/40 transition-colors"
                >
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tag.classes}`}>
                    {tag.label}
                  </span>
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {b.phone}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <BedDouble className="h-3.5 w-3.5" />
                    {ROOM_LABEL[b.room] ?? b.room}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {b.guests}
                  </span>
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${STATUS_COLOR[b.status] ?? "bg-zinc-400"}`}
                    title={b.status === "confirmed" ? "Подтверждена" : "Новая"}
                  />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
