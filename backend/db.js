import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('Configuration error: DATABASE_URL environment variable is not set or is empty.')
  process.exit(1)
}
const sql = postgres(connectionString)

export default sql
