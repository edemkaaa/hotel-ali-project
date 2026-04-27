import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Welcome } from "@/components/welcome"
import { Rooms } from "@/components/rooms"
import { Gallery } from "@/components/gallery"
import { About } from "@/components/about"
import { PlacesPreview } from "@/components/places-preview"
import { Contacts } from "@/components/contacts"
import { Footer } from "@/components/footer"
import { getRoomPrices, getRoomsWithPrices } from "@/lib/prices"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [rooms, prices] = await Promise.all([getRoomsWithPrices(), getRoomPrices()])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Welcome />
        <Rooms rooms={rooms} />
        <Gallery />
        <About />
        <PlacesPreview />
        <Contacts prices={prices} />
      </main>
      <Footer />
    </>
  )
}

