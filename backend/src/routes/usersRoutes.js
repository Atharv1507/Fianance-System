import { Router } from "express"
import { createUser, createTransaction, getMyTransactions } from "../controllers/usersController.js"

const router = Router()

router.post("/create", createUser)
router.post("/transaction", createTransaction)
router.get("/transactions/:id", getMyTransactions)

export default router
