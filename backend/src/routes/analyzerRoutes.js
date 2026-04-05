import { Router } from "express"
import { getAllRecords } from "../controllers/analyzerController.js"

const router = Router()

router.get('/allRecords', getAllRecords)

export default router
