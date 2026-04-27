import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Coins,
  MapPin,
  Navigation,
  Sun,
  Lightbulb,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlaceCard } from "@/components/place-card"
import { getPlace, places } from "@/lib/places"

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const place = getPlace(slug)
  if (!place) return { title: "Место не найдено" }
  return {
    title: `${place.name} — гид рядом с гостевым домом «Восток»`,
    description: place.summary,
  }
}

export default async function PlacePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const place = getPlace(slug)
  if (!place) notFound()

  const others = places.filter((p) => p.slug !== place.slug).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.summary,
    touristType: "Family, Couples, Hikers",
  }

  const facts = [
    { icon: MapPin, label: "Расстояние", value: place.distance },
    { icon: Navigation, label: "Дорога", value: place.travelTime },
    { icon: Clock, label: "Сколько занимает", value: place.duration },
    { icon: Sun, label: "Когда лучше", value: place.bestTime },
    { icon: Coins, label: "Бюджет", value: place.cost },
  ]

  return (
    <>
      <Header />
      <main className="pt-32 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Все места
          </Link>

          <div
            className={`relative aspect-[16/9] rounded-3xl bg-gradient-to-br ${place.gradient} flex items-center justify-center mb-8 overflow-hidden`}
          >
            {place.image ? (
              <Image
                src={place.image}
                alt={place.name}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="text-9xl">{place.emoji}</div>
            )}
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium z-10 shadow-md">
              <MapPin className="h-4 w-4 text-primary" />
              {place.distance}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {place.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-10">{place.tagline}</p>

          <p className="text-base md:text-lg text-foreground leading-relaxed mb-10">
            {place.summary}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {facts.map((f) => (
              <div
                key={f.label}
                className="bg-primary/5 border border-primary/10 rounded-2xl p-4"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary mb-3">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  {f.label}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8 mb-12">
            {place.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {s.heading}
                </h2>
                <p className="text-foreground/90 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6">
              <div className="inline-flex items-center gap-2 text-amber-700 font-semibold mb-4">
                <Lightbulb className="h-5 w-5" />
                Лайфхаки
              </div>
              <ul className="space-y-2.5">
                {place.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-amber-600 font-bold flex-shrink-0">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
              <div className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
                <Navigation className="h-5 w-5" />
                Как добраться
              </div>
              <ul className="space-y-2.5">
                {place.howToGet.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-primary font-bold flex-shrink-0">·</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 text-center mb-14">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Останьтесь на пару дней
            </h3>
            <p className="text-muted-foreground mb-5">
              Гостевой дом «Восток» — в нескольких минутах от заповедника. Удобная база, чтобы успеть всё.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Забронировать номер
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Ещё рядом
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((p) => (
                <PlaceCard key={p.slug} place={p} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
