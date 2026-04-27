"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Users,
  Ruler,
  Layers,
  ShowerHead,
  Wifi,
  Snowflake,
  Tv,
  Refrigerator,
  Wind,
  Sparkles,
  Clock,
  Ban,
  Wine,
  Check,
} from "lucide-react"
import type { Room } from "@/lib/rooms"

const amenityIcon: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  Кондиционер: Snowflake,
  Телевизор: Tv,
  Холодильник: Refrigerator,
  Балкон: Wind,
  Фен: Sparkles,
}

export function RoomDetail({ room }: { room: Room }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <main className="pt-20 pb-12 md:pt-24 md:pb-20 bg-background">
      <div className="container mx-auto px-4">
        <Link
          href="/#rooms"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Все номера
        </Link>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Carousel */}
          <div className="lg:col-span-3">
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {room.images.map((src, i) => (
                  <CarouselItem key={src}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-lg">
                      <Image
                        src={src}
                        alt={`${room.name} — фото ${i + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 size-12 bg-white/90 hover:bg-white border-0 shadow-lg" />
              <CarouselNext className="right-4 size-12 bg-white/90 hover:bg-white border-0 shadow-lg" />
            </Carousel>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2 md:gap-3 mt-4">
              {room.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-all ${
                    current === i
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Миниатюра ${i + 1}`}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                Номер «Восток»
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {room.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {room.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-muted-foreground text-sm">за номер / сутки</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Гости</div>
                    <div className="text-sm font-semibold">до {room.guests}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-3">
                  <Ruler className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Площадь</div>
                    <div className="text-sm font-semibold">{room.size} м²</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-3">
                  <Layers className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Этаж</div>
                    <div className="text-sm font-semibold">{room.floors}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-3">
                  <ShowerHead className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Удобства</div>
                    <div className="text-sm font-semibold">{room.bathroom}</div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {room.longDescription}
              </p>

              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-3">В номере</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.amenities.map((a) => {
                    const Icon = amenityIcon[a] ?? Check
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{a}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-secondary/40 rounded-2xl p-5 mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Заезд с 14:00, выезд до 12:00</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Ban className="h-4 w-4 text-primary" />
                  <span>Без животных</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Wine className="h-4 w-4 text-primary" />
                  <span>Без спиртного</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full rounded-full text-base">
                <Link href="/#booking">Забронировать номер</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
