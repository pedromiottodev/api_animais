import { Router } from "express"
import { listarUsuarios, criarUsuario, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from "../controllers/usuarios.controller"
import { login } from "../controllers/login.controller"
import { autenticaToken } from "../middewares/auth.middleware"
import { solicitarCodigoRecuperacao } from "../controllers/usuarios.controller"
import { redefinirSenha } from "../controllers/usuarios.controller"

const usuariosRoutes = Router()


usuariosRoutes.get("/", autenticaToken, listarUsuarios)
usuariosRoutes.post("/", criarUsuario)
usuariosRoutes.get("/:id", autenticaToken, buscarUsuarioPorId)
usuariosRoutes.put("/:id", autenticaToken, atualizarUsuario)
usuariosRoutes.delete("/:id", autenticaToken, deletarUsuario)
usuariosRoutes.post("/login", login)
usuariosRoutes.post("/solicitar-codigo", solicitarCodigoRecuperacao)
usuariosRoutes.post("/redefinir-senha", autenticaToken, redefinirSenha)

export default usuariosRoutes