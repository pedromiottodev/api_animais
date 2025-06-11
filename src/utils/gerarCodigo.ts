/*
A pasta utils (abreviação de utilities) é um lugar onde colocamos funções auxiliares que não pertencem diretamente
a uma rota, controller ou serviço, mas que são úteis em vários pontos do sistema.
Exemplos comuns de utils:
Gerar um código aleatório
Validar CPF
Formatar datas
Calcular idade com base no nascimento
*/

/**
 * Gera um código de 6 dígitos aleatório
 */

export function gerarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
