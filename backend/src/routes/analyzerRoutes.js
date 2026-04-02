import { Router } from "express"
import { getFinancialSummary } from "../controllers/analyzerController.js"

const router = Router()

router.get("/financial-summary", getFinancialSummary)

export default router
