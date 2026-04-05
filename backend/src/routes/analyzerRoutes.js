import { Router } from "express"
import { getAllRecords } from "../controllers/analyzerController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)
router.use(authorize('ANALYST'))

router.get('/allRecords', getAllRecords)

export default router
