import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RoomDetail } from "@/components/room-detail"
import { getRoom, rooms } from "@/lib/rooms"
import { getRoomPrices } from "@/lib/prices"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) return { title: "Номер не найден" }
  return {
    title: `${room.name} — Гостевой дом «Восток»`,
    description: room.longDescription,
  }
}

export default async function RoomPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) notFound()
  const prices = await getRoomPrices()
  const roomWithPrice = { ...room, price: prices[slug] ?? room.price }

  return (
    <>
      <Header />
      <RoomDetail room={roomWithPrice} />
      <Footer />
    </>
  )
}

