import { Request, Response, NextFunction } from "express";

//essa função será chamada sempre que precisarmos acessar uma rota protegida 
export function verificaPerfil(perfisPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    //nao entendi essa parte
    const usuario = (req as any).usuario;

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    if (!perfisPermitidos.includes(usuario.perfil)) {
      return res.status(403).json({ mensagem: "Acesso negado: perfil insuficiente" });
    }

    next();
  }
}