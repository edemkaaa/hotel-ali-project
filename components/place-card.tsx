import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, MapPin } from "lucide-react"
import type { Place } from "@/lib/places"

export function PlaceCard({ place }: { place: Place }) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
    >
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${place.gradient} flex items-center justify-center overflow-hidden`}
      >
        {place.image ? (
          <Image
            src={place.image}
            alt={place.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-7xl md:text-8xl transition-transform duration-500 group-hover:scale-110">
            {place.emoji}
          </div>
        )}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground z-10">
          <MapPin className="h-3 w-3 text-primary" />
          {place.distance}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {place.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {place.tagline}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4">
          <div className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {place.duration}
          </div>
          <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
            Подробнее
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
