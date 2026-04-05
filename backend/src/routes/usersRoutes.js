import { Router } from "express"
import { createUser, createTransaction, getMyTransactions, updateTransaction } from "../controllers/usersController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = Router()

// Registration — no auth needed (profile doesn't exist yet)
router.post("/create", createUser)

// Transaction endpoints — USER (and ADMIN via authorize) only
router.post("/transaction", authenticate, authorize('USER'), createTransaction)
router.put("/transaction/:id", authenticate, authorize('USER'), updateTransaction)
router.get("/transactions/:id", authenticate, authorize('USER'), getMyTransactions)

export default router
