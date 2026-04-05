import { Router } from "express"
import { getUsers, editUser, deleteUser } from "../controllers/adminController.js"
import { getRegistered } from "../controllers/authController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get("/allusers", getUsers)
router.get("/registered", getRegistered)
router.put("/edit/:id", editUser)
router.delete("/delete/:id", deleteUser)

export default router
