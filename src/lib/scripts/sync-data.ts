/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "dotenv"
import { Client } from "pg"
import { performance } from "perf_hooks"
import fs from "fs"

config()
// dangerous!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const PROD_DB_URL = process.env.PROD_DB_URL
const LOCAL_DB_URL = process.env.LOCAL_DB_URL
const PROD_USER_ID = process.env.MY_PROD_USER_ID
const LOCAL_USER_ID = process.env.MY_LOCAL_USER_ID
const cert_path = process.env.SSL_CERT_FILE

async function syncData() {
  if (!PROD_DB_URL || !LOCAL_DB_URL) {
    throw new Error("Please set PROD_DB_URL and LOCAL_DB_URL environment variables.")
  }
  const ca = fs.readFileSync(cert_path!).toString()

  const prodClient = new Client({
    connectionString: PROD_DB_URL,
    ssl: { ca, rejectUnauthorized: true },
  })
  const localClient = new Client({ connectionString: LOCAL_DB_URL })

  try {
    await Promise.all([
      prodClient.connect(),
      localClient.connect(),
    ])
  } catch (err) {
    console.error("Failed to connect to databases:", err)
    process.exit(1)
  }

  const t0 = performance.now()

  const sync = async () => {
    // 1. Read personal entries and activities from prod
    const [entriesRes] = await Promise.all([
      prodClient.query(
        'SELECT * FROM "Entry" WHERE "userId" = $1',
        [PROD_USER_ID],
      ),
    ])
    const t1 = performance.now()
    console.log(`Fetched prod entires (${entriesRes.rowCount}) in ${(t1 - t0).toFixed(2)} ms`)

    // 2. Put data in local db
    await localClient.query("BEGIN")
    try {
      // 2.1 Delete local data
      await localClient.query('DELETE FROM "Entry" WHERE "userId" = $1', [LOCAL_USER_ID])
      const t2 = performance.now()
      console.log(`Deleted local data in ${(t2 - t1).toFixed(2)} ms`)

      // 2.2 Insert entries from prod (bulk insert)
      if (entriesRes.rows.length > 0) {
        // Set userId to LOCAL_USER_ID for all activities
        const entries = entriesRes.rows.map(entry => ({
          ...entry,
          userId: LOCAL_USER_ID,
        }))
        const columns = Object.keys(entries[0])
        const values: any[] = []
        const valuePlaceholders = entries.map((entry, rowIdx) => {
          const rowPlaceholders = columns.map((_, colIdx) => {
            values.push(entry[columns[colIdx]])
            return `$${rowIdx * columns.length + colIdx + 1}`
          })
          return `(${rowPlaceholders.join(", ")})`
        })
        await localClient.query(
          `INSERT INTO "Entry" (${columns.map(c => `"${c}"`).join(", ")}) VALUES ${valuePlaceholders.join(", ")}`,
          values,
        )
      }
      const t3 = performance.now()
      console.log(`Inserted ${entriesRes.rowCount} entries in ${(t3 - t2).toFixed(2)} ms`)


      await localClient.query("COMMIT")
      console.log(`Total elapsed time: ${(t3 - t0).toFixed(2)} ms`)
    } catch (err) {
      await localClient.query("ROLLBACK")
      throw err
    }
    console.log("Sync complete!")
  }

  try {
    await sync()
  } catch (err) {
    console.error("Error during sync:", err)
  } finally {
    await prodClient.end()
    await localClient.end()
  }
}

syncData()