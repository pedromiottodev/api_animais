import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function login(req: Request, res: Response){
    const {email, senha} = req.body

    if(!email || !senha){
        return res.status(400).json({mensagem: "E-mail e senha são obrigatórios"})
    }

    try{
        //buscando usuário pelo e-mail
        const usuario = await prisma.usuario.findUnique({where: {email}})

        if(!usuario){
            return res.status(404).json({mensagem: "Usuário não encontrado"})
        }
        /*
        bcrypt.compare() retorna uma Promise que resolve para um boolean:
        true → se a senha informada e o hash armazenado forem equivalentes.
        false → se não forem equivalentes.

        O bcrypt.compare não descriptografa o hash.
        Ele criptografa a senha digitada e compara com o hash armazenado.
        O algoritmo garante que, se for a mesma senha, o resultado será true.
        */
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if(!senhaValida){
            return res.status(401).json({mensagem: "Senha inválida"})
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