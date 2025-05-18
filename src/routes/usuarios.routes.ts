import {Router} from "express"
import {criarUsuario, listarUsuarios} from "../controllers/usuarios.controller"

const usuariosRoutes = Router()

usuariosRoutes.post("/", criarUsuario)
usuariosRoutes.get("/", listarUsuarios)


export default usuariosRoutes
