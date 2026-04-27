import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"
import { places } from "@/lib/places"
import { PlaceCard } from "./place-card"

export function PlacesPreview() {
  const featured = places.slice(0, 3)

  return (
    <section id="places" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider mb-4">
            <Compass className="h-3.5 w-3.5" />
            Окрестности
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Что посмотреть рядом
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Карадаг, тропа Голицына, набережная Коктебеля, Айвазовский в Феодосии — у нас под боком одни из самых красивых мест полуострова.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Все места рядом
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
