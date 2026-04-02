import { Router } from "express"
import { getAdminOverview } from "../controllers/adminController.js"
import getRegisteredController from "../controllers/authController.js"
const router = Router()

router.get("/overview", getAdminOverview)
router.get("/registered", getRegisteredController)

export default router
