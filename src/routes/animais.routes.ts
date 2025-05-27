import { Router } from "express"
import { atualizarAnimal, atualizarParcialmente, buscarAnimalPorId, criarAnimal, deletarAnimal, listarAnimais } from "../controllers/animais.controller"
import { autenticaToken } from "../middewares/auth.middleware"

const animaisRoutes = Router()

animaisRoutes.get("/",  autenticaToken, listarAnimais)
animaisRoutes.post("/", autenticaToken, criarAnimal)
animaisRoutes.get("/:id", autenticaToken, buscarAnimalPorId)
animaisRoutes.put("/:id", autenticaToken, atualizarAnimal)
animaisRoutes.delete("/:id", autenticaToken, deletarAnimal)
animaisRoutes.patch("/:id", autenticaToken, atualizarParcialmente)

export default animaisRoutes