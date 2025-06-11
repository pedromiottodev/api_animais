import { z } from "zod";

export const animalSchema = z.object({
  nome: z.string()
    .min(1, "O nome é obrigatório")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),
  
  tipo: z.string()
    .min(1, "O tipo é obrigatório")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O tipo deve conter apenas letras"),
  
  idade: z.number()
    .int("A idade deve ser um número inteiro")
    .nonnegative("A idade deve ser um número positivo ou zero")
})


