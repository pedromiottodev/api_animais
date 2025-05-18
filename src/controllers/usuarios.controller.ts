import {Request, Response} from "express"

export function criarUsuario(req: Request, res: Response){
    const {nome, email} = req.body

    //verificações básicas
    if(!nome || !email){
        return res.status(400).json({mensagem: "Nome e e-mail são obrigatórios"})
    }

    //aqui futuramente vai a lógica de salvar no banco de dados
    return res.status(201).json({mensagem: "Usuário criado com sucesso", dados: {nome, email}
    })
}

export function listarUsuarios(req: Request, res: Response){
    const usuarios = [
        {id: 1, nome: "Pedro", email: "pedro@gmail.com"},
        {id: 2, nome: "Tatiane", email: "tatiane@gmail.com"}
    ]

    return res.status(200).json(usuarios)
}