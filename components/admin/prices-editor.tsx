"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Tag, Loader2, Check } from "lucide-react"
import { formatRub } from "@/lib/rooms"

type PriceItem = {
  slug: string
  name: string
  price: number
  defaultPrice: number
}

export function PricesEditor() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<PriceItem[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/prices", { cache: "no-store" })
      if (!res.ok) throw new Error("Не удалось загрузить цены")
      const data = await res.json()
      setItems(data.prices)
      setDrafts(
        Object.fromEntries(data.prices.map((p: PriceItem) => [p.slug, String(p.price)]))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && items.length === 0) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const isDirty = items.some((i) => Number(drafts[i.slug] ?? "") !== i.price)

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, number> = {}
      for (const item of items) {
        const v = Number(drafts[item.slug])
        if (Number.isFinite(v) && v !== item.price) payload[item.slug] = v
      }
      const res = await fetch("/api/admin/prices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices: payload }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Не удалось сохранить")
      }
      const data = await res.json()
      setItems((prev) =>
        prev.map((p) => ({ ...p, price: data.prices[p.slug] ?? p.price }))
      )
      setDrafts((prev) => {
        const next = { ...prev }
        for (const k of Object.keys(next)) {
          if (data.prices[k] !== undefined) next[k] = String(data.prices[k])
        }
        return next
      })
      setSavedAt(Date.now())
      setTimeout(() => setSavedAt(null), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Tag className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-foreground">Цены номеров</h2>
            <p className="text-xs text-muted-foreground">
              Изменение цен сразу отразится на сайте и в новых заявках
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/50 p-5">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка...
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {items.map((item) => {
                  const draft = drafts[item.slug] ?? ""
                  const draftNum = Number(draft)
                  const changed = Number.isFinite(draftNum) && draftNum !== item.price
                  return (
                    <div key={item.slug} className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        {item.name}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          step={100}
                          value={draft}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [item.slug]: e.target.value }))
                          }
                          className={`h-11 rounded-xl pr-12 ${
                            changed ? "border-primary" : ""
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          ₽ / сутки
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Сейчас: <span className="font-medium">{formatRub(item.price)}</span>
                        {item.defaultPrice !== item.price && (
                          <span className="ml-2">
                            (по умолчанию {formatRub(item.defaultPrice)})
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-3">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                {savedAt && (
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
                    <Check className="h-4 w-4" />
                    Сохранено
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDrafts(
                      Object.fromEntries(items.map((p) => [p.slug, String(p.price)]))
                    )
                  }
                  disabled={!isDirty || saving}
                  className="rounded-full"
                >
                  Сбросить
                </Button>
                <Button
                  size="sm"
                  onClick={save}
                  disabled={!isDirty || saving}
                  className="rounded-full"
                >
                  {saving ? "Сохранение..." : "Сохранить цены"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
