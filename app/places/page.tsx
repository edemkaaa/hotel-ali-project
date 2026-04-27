import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlaceCard } from "@/components/place-card"
import { places } from "@/lib/places"

export const metadata: Metadata = {
  title: "Окрестности — что посмотреть рядом с гостевым домом «Восток»",
  description:
    "Карадагский заповедник, Тихая бухта, Коктебель, Новый Свет и Феодосия — гид по главным местам в окрестностях посёлка Курортное.",
}

export default function PlacesPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>

          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider mb-4">
              <Compass className="h-3.5 w-3.5" />
              Гид по округе
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Что посмотреть рядом
            </h1>
            <p className="text-lg text-muted-foreground">
              Курортное стоит у самого Карадага — отсюда удобно добираться и до диких бухт, и до главных туристических точек юго-восточного Крыма. Собрали места, ради которых сюда стоит ехать.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.slug} place={place} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
