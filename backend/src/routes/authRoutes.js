import { Router } from "express"
import { getUserRole } from "../controllers/authController.js"

const router = Router()

router.get("/role/:id", getUserRole)

export default router