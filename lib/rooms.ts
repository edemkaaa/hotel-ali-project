export type Room = {
  slug: string
  name: string
  shortName: string
  description: string
  longDescription: string
  price: number
  images: string[]
  guests: number
  size: number
  floors: string
  totalRooms: number
  bathroom: string
  amenities: string[]
}

export const rooms: Room[] = [
  {
    slug: "standard-2",
    name: "«Стандарт» 2х-местный",
    shortName: "2-местный",
    description:
      "Двуспальная кровать, шкаф, тумбочки, вешалка. Возможно дополнительное место (платно).",
    longDescription:
      "Уютный двухместный номер для пары или одного гостя. Просторная двуспальная кровать, балкон, мягкое освещение и продуманная планировка делают пребывание комфортным. Возможно размещение дополнительного места за отдельную плату.",
    price: 2500,
    images: [
      "/images/rooms/standard-1.jpg",
      "/images/rooms/standard-2.jpg",
      "/images/rooms/standard-3.jpg",
      "/images/rooms/standard-4.jpg",
      "/images/rooms/standard-5.jpg",
    ],
    guests: 2,
    size: 15,
    floors: "2-4",
    totalRooms: 19,
    bathroom: "Санузел + душ",
    amenities: ["Кондиционер", "Телевизор", "Wi-Fi", "Холодильник", "Балкон"],
  },
  {
    slug: "standard-3",
    name: "«Стандарт» 3х-местный",
    shortName: "3-местный",
    description:
      "Односпальные и двуспальная кровати, шкаф, тумбочки, вешалка. Возможно дополнительное место (платно).",
    longDescription:
      "Просторный трёхместный номер с двуспальной и односпальной кроватями. Подойдёт для семьи из трёх человек или компании друзей. В номере всё необходимое для отдыха: фен, банные принадлежности, балкон с видом на территорию.",
    price: 3000,
    images: [
      "/images/rooms/deluxe-1.jpg",
      "/images/rooms/deluxe-2.jpg",
      "/images/rooms/deluxe-3.jpg",
      "/images/rooms/deluxe-4.jpg",
      "/images/rooms/deluxe-5.jpg",
    ],
    guests: 3,
    size: 17,
    floors: "2-4",
    totalRooms: 8,
    bathroom: "Санузел + душ",
    amenities: [
      "Кондиционер",
      "Телевизор",
      "Wi-Fi",
      "Холодильник",
      "Балкон",
      "Фен",
      "Банные принадлежности",
    ],
  },
  {
    slug: "standard-4",
    name: "«Стандарт» 4х-местный",
    shortName: "4-местный",
    description:
      "Односпальные и двуспальная кровати, шкаф, тумбочки, вешалка. Возможно дополнительное место (платно).",
    longDescription:
      "Самый просторный номер на 4 гостей — идеален для семьи с детьми или компании. Двуспальная и две односпальные кровати, шкаф-купе с зеркалом, кондиционер. Возможно дополнительное место за отдельную плату.",
    price: 4000,
    images: [
      "/images/rooms/family-1.jpg",
      "/images/rooms/family-2.jpg",
      "/images/rooms/family-3.jpg",
      "/images/rooms/family-4.jpg",
      "/images/rooms/family-5.jpg",
    ],
    guests: 4,
    size: 19,
    floors: "2-4",
    totalRooms: 2,
    bathroom: "Санузел + душ",
    amenities: [
      "Кондиционер",
      "Телевизор",
      "Wi-Fi",
      "Холодильник",
      "Туалетно-косметические принадлежности",
    ],
  },
]

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug)
}

export function nightsBetween(checkin: string, checkout: string): number {
  const start = new Date(checkin)
  const end = new Date(checkout)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  const ms = end.getTime() - start.getTime()
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export function calculateBooking(
  roomSlug: string,
  checkin: string,
  checkout: string,
  priceOverride?: number
): { nights: number; pricePerNight: number; total: number; roomName: string | null } {
  const room = getRoom(roomSlug)
  const pricePerNight = priceOverride ?? room?.price ?? 0
  const nights = nightsBetween(checkin, checkout)
  return {
    nights,
    pricePerNight,
    total: nights * pricePerNight,
    roomName: room?.name ?? null,
  }
}

export function formatRub(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`
}
