import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import path from "node:path"
import * as schema from "./schema"

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "bookings.db")
const url = dbPath.startsWith("file:") || dbPath.startsWith("libsql:")
  ? dbPath
  : `file:${dbPath}`

const client = createClient({ url })

await client.execute(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    checkin TEXT NOT NULL,
    checkout TEXT NOT NULL,
    room TEXT NOT NULL,
    guests TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

await client.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`)
await client.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC)`)

await client.execute(`
  CREATE TABLE IF NOT EXISTS room_prices (
    slug TEXT PRIMARY KEY,
    price INTEGER NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

const DEFAULT_PRICES: Array<[string, number]> = [
  ["standard-2", 2500],
  ["standard-3", 3000],
  ["standard-4", 4000],
]
for (const [slug, price] of DEFAULT_PRICES) {
  await client.execute({
    sql: `INSERT OR IGNORE INTO room_prices (slug, price) VALUES (?, ?)`,
    args: [slug, price],
  })
}

export const db = drizzle(client, { schema })
export { schema }
