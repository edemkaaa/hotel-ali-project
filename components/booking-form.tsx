"use client"

import { useMemo, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Wallet, Loader2, CheckCircle2 } from "lucide-react"
import { calculateBooking, formatRub } from "@/lib/rooms"

const ROOM_OPTIONS = [
  { value: "standard-2", label: "2х-местный" },
  { value: "standard-3", label: "3х-местный" },
  { value: "standard-4", label: "4х-местный" },
] as const

function nightsLabel(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "ночь"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "ночи"
  return "ночей"
}

export function BookingForm({ prices }: { prices?: Record<string, number> }) {
  const priceMap = useMemo<Record<string, number>>(
    () => ({
      "standard-2": prices?.["standard-2"] ?? 2500,
      "standard-3": prices?.["standard-3"] ?? 3000,
      "standard-4": prices?.["standard-4"] ?? 4000,
    }),
    [prices]
  )

  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [room, setRoom] = useState<string>("standard-2")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const pricing = useMemo(
    () => calculateBooking(room, checkin, checkout, priceMap[room]),
    [room, checkin, checkout, priceMap]
  )

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    setIsLoading(true)
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? "Не удалось отправить заявку. Попробуйте позже.")
        return
      }
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      setCheckin("")
      setCheckout("")
      setRoom("standard-2")
    } catch {
      setError("Сеть недоступна. Попробуйте позже.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "rounded-xl h-12"
  const selectClass =
    "flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  if (success) {
    return (
      <div className="bg-card rounded-3xl shadow-lg p-8 md:p-12 border border-border text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" strokeWidth={2} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Заявка отправлена!
        </h3>
        <p className="text-muted-foreground text-base mb-2">
          Спасибо за бронирование. Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          Если у вас срочный вопрос — позвоните нам или напишите в WhatsApp / Telegram.
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSuccess(false)}
          className="rounded-full px-8"
        >
          Отправить ещё одну заявку
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-3xl shadow-lg p-5 sm:p-6 md:p-8 border border-border">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Забронировать номер</h3>
        <p className="text-muted-foreground text-sm">Заполните форму и мы свяжемся с вами</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Ваше имя *</Label>
            <Input id="name" name="name" required placeholder="Иван Иванов" className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Телефон *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+7 (999) 123-45-67"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ivan@example.com"
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkin" className="text-sm font-medium">Дата заезда *</Label>
            <Input
              id="checkin"
              name="checkin"
              type="date"
              required
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout" className="text-sm font-medium">Дата выезда *</Label>
            <Input
              id="checkout"
              name="checkout"
              type="date"
              required
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="room" className="text-sm font-medium">Тип номера *</Label>
            <Select name="room" required value={room} onValueChange={setRoom}>
              <SelectTrigger id="room" className="rounded-xl h-12 w-full">
                <SelectValue placeholder="Выберите номер" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label} ({formatRub(priceMap[o.value] ?? 0)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium">Гостей *</Label>
            <Select name="guests" required>
              <SelectTrigger id="guests" className="rounded-xl h-12 w-full">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 гость</SelectItem>
                <SelectItem value="2">2 гостя</SelectItem>
                <SelectItem value="3">3 гостя</SelectItem>
                <SelectItem value="4">4 гостя</SelectItem>
                <SelectItem value="5+">5+ (доп. места)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">Пожелания</Label>
          <textarea
            id="message"
            name="message"
            placeholder="Дополнительное место, ранний заезд..."
            rows={3}
            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>

        {pricing.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Wallet className="h-5 w-5 text-primary" />
              <span>
                {pricing.nights} {nightsLabel(pricing.nights)} × {formatRub(pricing.pricePerNight)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Итого</div>
              <div className="text-2xl font-bold text-primary leading-tight">
                {formatRub(pricing.total)}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full h-14 text-base gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Отправить заявку
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>
    </div>
  )
}
