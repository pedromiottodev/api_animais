import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"


export function autenticaToken(req: Request, res: Response, next: NextFunction){
    //authorization é o nome padrão de header que carrega credenciais (token de acesso, basic auth(usuário e senha))
    /*
    no caso do token JWT, o padrão é:
    Authorization: Bearer <token>
    Bearer -> é uma convenção para indicar que é um token
    o que nos interessa é o token, por isso fazemos authHeader.split(' ')[1]
    */
   const authHeader = req.headers["authorization"]
    //authHeader && é uma forma segura de evitar erro caso o authHeader seja undefined
    //se o authHeader existir, fazemos o split, se não o token fica undefined
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        //403 -> não autorizado/não autenticado
        return res.status(403).json({mensagem: "Token não fornecido"})
    }

    try{
        const JWT_SECRET = process.env.JWT_SECRET as string 
        /*
        o retorno do jwt.verify pode ser:
        string: se foi codificado sem payload
        object: se foi codificado com payload
        mas o typescript não consegue inferir automaticamente

        para evitar o erro, tipamos explicitamente
        JWT_SECRET é uma string (pois o process.env pode ser undefined)
        o retorno é um JwtPayload

        por que jwt.verify pode retornar uma string ou object?
        quando criamos um jwt, podemos colocar um payload dentro dele, ou não
        se tem payload o jwt será:
        header -> tipo e algoritmo
        payload -> dados(ex: id, email)
        signature -> assinatura

        caso não tenha payload, será apenas header + signature

        quando o jwt.verify decodifica:
        se não tinha payload -> retorna uma string ou null
        se tinha -> retorna um objeto que contêm os dados

        quase sempre usamos payload → por isso, no mundo real, o retorno é objeto.
        */
       //usuário é a informação decodificada no token (id, nome, email, etc...)
        const usuario = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

        //estamos anexando essa informação em nossa requisição
        /*
        por que (req as any)?
        porque o tipo original do express -> não inclui usuário no Request
        */
        (req as any).usuario = usuario

        next()
    }
    //pq colocar any no err
    catch(err: any){
        //403 -> o cliente não tem direito de acesso ao conteúdo
        return res.status(403).json({mensagem: "Token inválido ou expirado"})
    }
}