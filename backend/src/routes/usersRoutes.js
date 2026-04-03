import { Router } from "express"
import { createUser } from "../controllers/usersController.js"

const router = Router()

router.post("/create", createUser)

export default router
