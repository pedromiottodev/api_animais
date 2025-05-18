import {Router} from "express"
import usuariosRoutes from "./usuarios.routes"
import animaisRoutes from "./animais.routes"

const router = Router()

router.use("/usuarios", usuariosRoutes)
router.use("/animais", animaisRoutes)

export default router