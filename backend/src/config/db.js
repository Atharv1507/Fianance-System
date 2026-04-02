import pkg from "pg"
import dotenv from "dotenv"
const { Pool } = pkg
dotenv.config()

const host = process.env.DB_HOST || process.env.DB_URL
const port = Number(process.env.DBPORT || process.env.DB_PORT || 5432)
const isLocal =
  !host ||
  host === "localhost" ||
  host === "127.0.0.1"

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port,
        ...(!isLocal && host ? { ssl: { rejectUnauthorized: false } } : {}),
      }
)
export default pool