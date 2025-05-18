import {Router, Request, Response} from "express"
import { criarAnimal, listarAnimais } from "../controllers/animais.controller"

const animaisRoutes = Router()

animaisRoutes.get("/", listarAnimais)
animaisRoutes.post("/", criarAnimal)

export default animaisRoutes