import {Request, Response} from "express"

export function listarAnimais(req: Request, res: Response){
    const animais = [
        {id: 1, nome: "Boby", tipo: "Cachorro", idade: 13},
        {id: 2, nome: "Bia", tipo: "Calopsita", idade: 5}
    ]

    return res.status(200).json(animais)
}

export function criarAnimal(req: Request, res: Response){
    const {nome, tipo, idade} = req.body
    
    if (!nome || !tipo || !idade === undefined){
        return res.status(400).json({mensagem: "Nome, tipo e idade são obrigatórios"})
    }

    return res.status(201).json({
        mensagem: "Animal cadastrado com sucesso!",
        dados: {nome, tipo, idade}
    })
}