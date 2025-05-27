import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function login(req: Request, res: Response){
    const {email} = req.body

    if(!email){
        return res.status(400).json({mensagem: "E-mail é obrigatório"})
    }

    try{
        const usuario = await prisma.usuario.findUnique({where: {email}})

        if(!usuario){
            return res.status(404).json({mensagem: "Usuário não encontrado"})
        }
        //jwt_secret serve para assinar o token, cria uma assinatura digital que comprova que o token foi gerado por este servidor
        //quando o cliente enviar o token de volta, o sistema usa a mesma chave para confirmar se o token é válido e não foi modificado
        //o cliente envia o token de volta sempre que ele queira acessar uma rota protegida
        const JWT_SECRET = process.env.JWT_SECRET as string

        //jwt.sign(payload(dados que desejo guardar no token), secret, options)
        const token = jwt.sign(
            {id: usuario.id, email: usuario.email},
            JWT_SECRET, {expiresIn: "1h"}
        )

        return res.status(200).json({token})
    }
    catch(err){
        console.error("Erro ao realizar login login: ", err)
        return res.status(500).json({mensagem: "Erro ao realizar login"})
    }
}