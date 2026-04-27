"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
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
  ArrowRight,
  Waves,
  MapPin,
  Store,
  ShoppingCart,
  Bus,
  Pill,
  Footprints,
} from "lucide-react"
import { rooms as defaultRooms, type Room, formatRub } from "@/lib/rooms"

const amenityIcon: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  Кондиционер: Snowflake,
  Телевизор: Tv,
  Холодильник: Refrigerator,
  Балкон: Wind,
  Фен: Sparkles,
}

const distances = [
  { icon: Waves, title: "Пляж галечный", time: "10 мин" },
  { icon: MapPin, title: "Набережная", time: "10 мин" },
  { icon: MapPin, title: "Центр", time: "10 мин" },
  { icon: Store, title: "Рынок", time: "10 мин" },
  { icon: ShoppingCart, title: "Продукты", time: "5 мин" },
  { icon: Bus, title: "Остановка", time: "5 мин" },
  { icon: Pill, title: "Аптека", time: "10 мин" },
]

export function Rooms({ rooms = defaultRooms }: { rooms?: Room[] }) {
  const router = useRouter()
  return (
    <section id="rooms" className="pt-16 md:pt-24 pb-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Размещение</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Наши номера
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Выберите номер, который подходит именно вам
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {rooms.map((room) => {
            const visibleAmenities = room.amenities.slice(0, 4)
            const extraCount = room.amenities.length - visibleAmenities.length
            return (
              <div
                key={room.slug}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/rooms/${room.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/rooms/${room.slug}`)
                  }
                }}
                aria-label={`Подробнее о номере ${room.name}`}
                className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative h-64 overflow-hidden">
                  <Carousel opts={{ loop: true }} className="w-full h-full">
                    <CarouselContent className="h-64">
                      {room.images.map((src, i) => (
                        <CarouselItem key={src} className="h-64">
                          <div className="relative h-64 w-full">
                            <Image
                              src={src}
                              alt={`${room.name} — фото ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CarouselPrevious className="left-3 size-10 bg-white/90 hover:bg-white border-0 shadow z-20" />
                      <CarouselNext className="right-3 size-10 bg-white/90 hover:bg-white border-0 shadow z-20" />
                    </div>
                  </Carousel>

                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-foreground/70 text-white text-xs font-medium backdrop-blur-sm">
                    {room.totalRooms} номеров
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold shadow-lg">
                    {formatRub(room.price)}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-4">{room.name}</h3>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>до {room.guests} гостей</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      <span>{room.size} кв. м.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>Этаж {room.floors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShowerHead className="h-4 w-4 text-primary" />
                      <span>{room.bathroom}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {visibleAmenities.map((a) => {
                      const Icon = amenityIcon[a] ?? Sparkles
                      return (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {a}
                        </span>
                      )
                    })}
                    {extraCount > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        +{extraCount}
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-auto flex gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button asChild variant="outline" className="flex-1 rounded-full">
                      <Link href={`/rooms/${room.slug}`}>
                        Подробнее <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-full">
                      <Link href="#booking">Забронировать</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div id="location" className="scroll-mt-24 rounded-3xl bg-primary/5 border border-primary/10 p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Расстояния от гостевого дома
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {distances.map((d) => (
              <div
                key={d.title}
                className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <d.icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{d.title}</div>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Footprints className="h-3 w-3" />
                  {d.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
