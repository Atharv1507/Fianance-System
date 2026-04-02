import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import errorHandling from "./middleware/errorHandler.js"
import createUsersTable from "./data/createUsersTable.js"
import createFinancialTable from "./data/createFinancial.js"
import usersRoutes from "./routes/usersRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import analyzerRoutes from "./routes/analyzerRoutes.js"


dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Create tables on startup.
// If DB connection fails (e.g. DNS/network), don't crash the whole server.
const initDb = async () => {
  try {
    await createUsersTable()
    await createFinancialTable()
    console.log("Database tables ensured")
  } catch (err) {
    console.error("Database initialization failed:", err?.message || err)
  }
}
initDb()

app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/analyzer", analyzerRoutes)

app.get('/', async (req, res) => {
    res.send("The database name is :" + process.env.DB_NAME)
})

app.use(errorHandling)

app.listen(8080,()=>{
    console.log(`Server is running on port 8080`)
})
