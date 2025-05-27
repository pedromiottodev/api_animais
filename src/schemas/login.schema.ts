import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .email("Informe um e-mail válido"),
  
  senha: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
})
