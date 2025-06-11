import { Router } from "express"
import { atualizarAnimal, atualizarParcialmente, buscarAnimalPorId, criarAnimal, deletarAnimal, listarAnimais } from "../controllers/animais.controller"
import { autenticaToken } from "../middewares/auth.middleware"
import { verificaPerfil } from "../middewares/verificacao.middleware"

const animaisRoutes = Router()

animaisRoutes.get("/",  autenticaToken, listarAnimais)
animaisRoutes.post("/", autenticaToken, verificaPerfil(["admin", "protetor"]), criarAnimal)
animaisRoutes.get("/:id", autenticaToken, buscarAnimalPorId)
animaisRoutes.put("/:id", autenticaToken, verificaPerfil(["admin", "protetor"]), atualizarAnimal)
animaisRoutes.delete("/:id", autenticaToken, verificaPerfil(["admin", "protetor"]), deletarAnimal)
animaisRoutes.patch("/:id", autenticaToken, verificaPerfil(["admin", "protetor"]), atualizarParcialmente)

export default animaisRoutes