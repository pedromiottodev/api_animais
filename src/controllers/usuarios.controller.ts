import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { usuarioSchema } from "../schemas/usuario.schema"
import bcrypt from "bcryptjs"
import {enviarEmailDeBoasVindas} from "../services/email.service"
import { gerarCodigo } from "../utils/gerarCodigo"
import { enviarEmailRecuperacaoSenha } from "../services/email.service"

function validaNome(nome: string): boolean {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(nome)
}


function validaEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const prisma = new PrismaClient()


export async function listarUsuarios(req: Request, res: Response) {

    try {
        const usuarios = await prisma.usuario.findMany()

        return res.status(200).json(usuarios)
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao listar usuários" })
    }
}
//criar usuario = cadastro
export async function criarUsuario(req: Request, res: Response) {
    /*
    O método safeParse() → é a forma segura de validar dados no Zod.
    O que ele faz:
    Tenta validar os dados do req.body com base no usuarioSchema.
    Retorna um objeto com duas propriedades:

    | Propriedade | O que significa                                |
    | ----------- | ---------------------------------------------- |
    | `success`   | `true` → passou na validação; `false` → falhou |
    | `data`      | os dados já **validados e tipados**            |
    | `error`     | se falhou → contém **detalhes do erro**        |

    */
    const validacao = usuarioSchema.safeParse(req.body)

    if(!validacao.success){
        //se a verificação falhar mandamos um json com a lista de erros gerada pelo zod
        //cada erro descreve qual campo falhou e qual foi o erro
        return res.status(400).json({erros: validacao.error.errors})
    }
    
    //se a validação der certo o data contém o objeto validado e tipado
    const {nome, email, senha, perfil} = validacao.data

    try {
        const senhaHash = await bcrypt.hash(senha, 10)
        const novoUsuario = await prisma.usuario.create({ data: { nome, email, senha: senhaHash, perfil}})

        console.log("Enviando e-mail para", email)

        try {
            await enviarEmailDeBoasVindas(email, nome)
        }
        catch (erroEmail) {
            console.error("Erro ao enviar e-mail de boas-vindas:", erroEmail)
            // (opcional) você pode registrar no banco/log para tentar reenviar depois
        }

        res.status(201).json({
            mensagem: "Usuário criado com sucesso", novoUsuario
        })
    }

    catch (err: any) {
        console.error("Erro ao criar usuário:", err)
        //o erro P2002 é gerado pelo prisma quando há uma tentativa de inserir um valor duplicado num campo que deve ser único
        if (err.code === "P2002") {
            return res.status(400).json({ mensagem: "E-mail já cadastrado" })
        }
        console.error("Erro inesperado ao criar usuário:", err)
        return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" })
    }
}

export async function buscarUsuarioPorId(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    try {
        const usuarioExiste = await prisma.usuario.findUnique({ where: { id } })

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }

        return res.status(200).json(usuarioExiste)
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao localizar usuário" })
    }
}

export async function atualizarUsuario(req: Request, res: Response) {
    const id = Number(req.params.id)
    const { nome, email } = req.body
    const usuario = req as any

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    if (!nome || !email) {
        return res.status(400).json({ mensagem: "Nome e e-mail são obrigatórios" })
    }

    if (!validaNome(nome)) {
        return res.status(400).json({ mensagem: "Informe apenas letras no nome de usuário" })
    }

    if (!validaEmail(email))
        return res.status(400).json({ mensagem: "Informe um e-mail válido, exemplo: usuario@servidor.com" })

    try {
        const usuarioExiste = await prisma.usuario.findUnique({ where: { id } })

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }

        if(usuario.usuario.perfil !== "admin" && usuario.usuario.id !== usuarioExiste.id){
            return res.status(403).json({mensagem: "Você não tem permissão para atualizar este usuário"})
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id },
            data: { nome, email }
        }
        )

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso", usuarioAtualizado })
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao atualizar usuário" })
    }
}

export async function deletarUsuario(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID inválido" })
    }

    try {
        const usuarioExiste = await prisma.usuario.findUnique({ where: { id } })

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }

        await prisma.usuario.delete({ where: { id } })

        //204 No Content quer dizer "deu tudo certo, mas o servidor não está enviando nenhuma informação no corpo da resposta"
        return res.status(204).send()
    }
    catch (err: any) {
        return res.status(500).json({ mensagem: "Erro ao deletar usuário" })
    }
}

export async function solicitarCodigoRecuperacao(req: Request, res: Response){
    const {email} = req.body

    if(!email){
        return res.status(400).json({mensagem: "O campo 'e-mail' é obrigatório"})
    }

    //realizar a validação do email

    try{
        const usuario = await prisma.usuario.findUnique({where: {email}})

        if(!usuario){
            return res.status(404).json({mensagem: "Nenhum usuário encontrado com esse e-mail"})
        }

        //estamos apenas passando a função para código ou código já tem o valor pronto?
        const codigo = gerarCodigo()
        /*
        Date.now() → retorna a data/hora atual em milissegundos desde 01/01/1970.
        15 * 60 * 1000 → converte 15 minutos para milissegundos.
        new Date(...) → transforma isso novamente em um objeto Date para armazenar no banco.
        */
        const expiracao = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.usuario.update({
            where: {email},
            data: {codigoVerificacao: codigo, expiracaoCodigo: expiracao}})
        
        await enviarEmailRecuperacaoSenha(usuario.email, usuario.nome, codigo)
        return res.status(200).json({mensagem: "Código de recuperação enviado para seu e-mail"})
    }
    catch(err: any){
        console.error("Erro ao solicitar código:", err)
        return res.status(500).json({mensagem: "Erro ao solicitar recuperação de senha"})
    }
}

export async function redefinirSenha(req: Request, res: Response){
    const {email, codigo, novaSenha} = req.body

    ///verificar se a nova senha não é igual a antiga
    if(!email || !codigo || !novaSenha){
        return res.status(400).json({mensagem: "E-mail, código e nova senha são obrigatórios"})
    }

    try{
        const usuario = await prisma.usuario.findUnique({where: {email}})

        if(!usuario){
            return res.status(404).json({mensagem: "Usuário não encontrado"})
        }

        if(usuario.codigoVerificacao !== codigo){
            return res.status(400).json({mensagem: "Código inválido"})
        }
        
        const agora = new Date()
        if(!usuario.expiracaoCodigo || agora > usuario.expiracaoCodigo){
            return res.status(400).json({mensagem: "Código expirado"})
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10)

        //atualizando a senha e removendo o código do banco
        await prisma.usuario.update({
            where: {email},
            data: {senha: senhaHash, codigoVerificacao: null, expiracaoCodigo: null}
        })

        return res.status(200).json({ mensagem: "Senha redefinida com sucesso" })

    }
    catch(err: any){
        console.error("Erro ao redefinir senha:", err)
        return res.status(500).json({ mensagem: "Erro interno ao redefinir senha" })
    }   
}