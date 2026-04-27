import { db, schema } from "./db"
import { rooms as defaultRooms, type Room } from "./rooms"

export type RoomWithPrice = Room

export async function getRoomPrices(): Promise<Record<string, number>> {
  const rows = await db.select().from(schema.roomPrices)
  const map: Record<string, number> = {}
  for (const r of rows) map[r.slug] = r.price
  for (const room of defaultRooms) {
    if (map[room.slug] === undefined) map[room.slug] = room.price
  }
  return map
}

export async function getRoomsWithPrices(): Promise<RoomWithPrice[]> {
  const prices = await getRoomPrices()
  return defaultRooms.map((r) => ({ ...r, price: prices[r.slug] ?? r.price }))
}
