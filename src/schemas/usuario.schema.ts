import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string()
    .min(1, "O nome é obrigatório")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),
  
  email: z.string()
    .email("Informe um e-mail válido")
})
