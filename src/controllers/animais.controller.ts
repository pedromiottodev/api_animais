import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { Animal } from "@prisma/client"
import { animalSchema } from "../schemas/animal.schema"

function validaNomeETipo(nome: string): boolean {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(nome)
}


const prisma = new PrismaClient()

export async function listarAnimais(req: Request, res: Response) {

    try {
        const animais = await prisma.animal.findMany()
        return res.status(200).json(animais)
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao listar animais" })
    }
}

export async function criarAnimal(req: Request, res: Response) {

    const validacao = animalSchema.safeParse(req.body)

    if(!validacao.success){
        return res.status(400).json({erros: validacao.error.errors})
    }

    const {nome, tipo, idade} = validacao.data

    try {
        const novoAnimal = await prisma.animal.create({ data: { nome, tipo, idade: Number(idade) } })

        return res.status(201).json({ mensagem: "Animal criado com sucesso", novoAnimal })
    }
    catch (err: any) {
        console.error("Erro ao criar usuário:", err)
        return res.status(500).json({ mensagem: "Erro ao cadastrar animal" })
    }
}

export async function buscarAnimalPorId(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    try {
        const animalExiste = await prisma.animal.findUnique({ where: { id } })

        if (!animalExiste) {
            return res.status(404).json({ mensagem: "Animal não encontrado" })
        }

        return res.status(200).json(animalExiste)
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao localizar animal" })
    }
}

export async function atualizarAnimal(req: Request, res: Response) {
    const id = Number(req.params.id)
    const { nome, tipo, idade } = req.body

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    if (!Number.isInteger(id) || !Math.sign(id)) {
        return res.status(400).json({ mensagem: "Informe um número inteiro e positivo como ID" })
    }

    if (!nome || !tipo || idade === undefined) {
        return res.status(400).json({ mensagem: "Nome, tipo e idade são obrigatórios" })
    }

    if (!validaNomeETipo(nome)) {
        return res.status(400).json({ mensagem: "Informe apenas letras no nome do animal" })
    }

    if (!validaNomeETipo(tipo)) {
        return res.status(400).json({ mensagem: "Informe apenas letras na espécie do animal" })
    }
    //VERIFICAR SE A IDADE É UM NÚMERO
    try {
        const animalExiste = await prisma.animal.findUnique({ where: { id } })

        if (!animalExiste) {
            return res.status(404).json({ mensagem: "Animal não encontrado" })
        }

        const animalAtualizado = await prisma.animal.update({
            where: { id },
            data: { nome, tipo, idade }
        }
        )

        return res.status(200).json({ mensagem: "Animal atualizado com sucesso", animalAtualizado })
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao atualizar animal" })
    }
}

export async function deletarAnimal(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    try {
        const animalExiste = await prisma.animal.findUnique({ where: { id } })

        if (!animalExiste) {
            return res.status(404).json({ mensagem: "Animal não encontrado" })
        }

        await prisma.animal.delete({ where: { id } })

        //204 No Content quer dizer "deu tudo certo, mas o servidor não está enviando nenhuma informação no corpo da resposta"
        return res.status(204).send()
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao deletar animal" })
    }
}

export async function atualizarParcialmente(req: Request, res: Response) {
    const id = Number(req.params.id)
    const {nome, tipo, idade} = req.body
    const animalAtualizar: Partial<Animal> = {}

    if (!Number.isInteger(id) || !Math.sign(id) || isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro e positivo como ID" })
    }

    if (!nome && !tipo && idade === undefined) {
        return res.status(400).json({ mensagem: "Informe nome, tipo ou idade" })
    }

    if(nome){
        if (!validaNomeETipo(nome)) {
            return res.status(400).json({ mensagem: "Informe apenas letras no nome do animal" })
        }
        animalAtualizar.nome = nome
    } 

    if(tipo){
        if (!validaNomeETipo(tipo)) {
            return res.status(400).json({ mensagem: "Informe apenas letras na espécie do animal" })
        }
        animalAtualizar.tipo = tipo
    }

    if(idade){
        if(!Number.isInteger(idade) || idade < 0){
            return res.status(400).json({mensagem: "A idade deve ser um número inteiro positivo"})
        }
        animalAtualizar.idade = idade
    }

    try{
        const animalExiste =  await prisma.animal.findUnique({where: {id}})

        if(!animalExiste){
            return res.status(404).json({mensagem: "Animal não encontrado"})
        }

        const animalAtualizado = await prisma.animal.update({where: {id}, data: animalAtualizar})

        return res.status(200).json({mensagem: "Animal atualizado com sucesso", animalAtualizado})
    }
    catch(err: any){
        return res.status(500).json({mensagem: "Erro ao atualizar animal"})
    }
}