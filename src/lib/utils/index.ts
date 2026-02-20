import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata o tempo de empresa a partir da data de inicio
 * @param dataInicio - Data de inicio no formato ISO ou YYYY-MM-DD
 * @returns String formatada (ex: "2 anos e 3 meses")
 */
export function formatarTempoEmpresa(dataInicio: string): string {
  const inicio = new Date(dataInicio)
  const agora = new Date()

  let anos = agora.getFullYear() - inicio.getFullYear()
  let meses = agora.getMonth() - inicio.getMonth()

  if (meses < 0) {
    anos--
    meses += 12
  }

  const partes: string[] = []

  if (anos > 0) {
    partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`)
  }

  if (meses > 0) {
    partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`)
  }

  if (partes.length === 0) {
    return 'Menos de 1 mes'
  }

  return partes.join(' e ')
}
