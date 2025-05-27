import { Router } from "express"
import { listarUsuarios, criarUsuario, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from "../controllers/usuarios.controller"
import { login } from "../controllers/login.controller"
import { autenticaToken } from "../middewares/auth.middleware"
const usuariosRoutes = Router()


usuariosRoutes.get("/", autenticaToken, listarUsuarios)
usuariosRoutes.post("/", criarUsuario)
usuariosRoutes.get("/:id", autenticaToken, buscarUsuarioPorId)
usuariosRoutes.put("/:id", autenticaToken, atualizarUsuario)
usuariosRoutes.delete("/:id", autenticaToken, deletarUsuario)
usuariosRoutes.post("/login", login)

export default usuariosRoutes