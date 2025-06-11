import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string()
    .min(1, "O nome é obrigatório")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),
  
  email: z.string()
    .email("Informe um e-mail válido"),
  
  senha: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),

  perfil: z.enum(["adotante", "protetor", "admin"]).optional().default("adotante")
})
