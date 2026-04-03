import { Router } from "express"
import { getUsers, editUser, deleteUser } from "../controllers/adminController.js"
import getRegisteredController from "../controllers/authController.js"
const router = Router()

router.get("/allusers", getUsers)
router.get("/registered", getRegisteredController)
router.put("/edit/:id", editUser)
router.delete("/delete/:id", deleteUser)

export default router
