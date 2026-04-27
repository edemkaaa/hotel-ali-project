import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  checkin: text("checkin").notNull(),
  checkout: text("checkout").notNull(),
  room: text("room").notNull(),
  guests: text("guests").notNull(),
  message: text("message"),
  status: text("status", { enum: ["new", "confirmed", "declined", "archived"] })
    .notNull()
    .default("new"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type BookingStatus = Booking["status"]

export const roomPrices = sqliteTable("room_prices", {
  slug: text("slug").primaryKey(),
  price: integer("price").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type RoomPrice = typeof roomPrices.$inferSelect
