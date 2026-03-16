/**
 * Sistema: tudo em moedas de bronze (base).
 * 100 bronze = 1 prata, 100 prata = 1 ouro → 10000 bronze = 1 ouro.
 * Retorna string para exibição: "x moedas de bronze, y moedas de prata e z moedas de ouro"
 * (apenas valores não zero, unidade no singular quando 1).
 */
export function formatMoedas(bronze) {
  const n = Math.floor(Number(bronze) || 0)
  const ouro = Math.floor(n / 10000)
  const prata = Math.floor((n % 10000) / 100)
  const bronz = n % 100
  const parts = []
  if (ouro > 0) parts.push(`${ouro} moeda${ouro !== 1 ? 's' : ''} de ouro`)
  if (prata > 0) parts.push(`${prata} moeda${prata !== 1 ? 's' : ''} de prata`)
  if (bronz > 0) parts.push(`${bronz} moeda${bronz !== 1 ? 's' : ''} de bronze`)
  if (parts.length === 0) return '0 moedas de bronze'
  if (parts.length === 1) return parts[0]
  return parts.slice(0, -1).join(', ') + ' e ' + parts[parts.length - 1]
}

/** Retorna { ouro, prata, bronze } para uso em ícones (valores numéricos). */
export function moedasParaOuroPrataBronze(bronze) {
  const n = Math.floor(Number(bronze) || 0)
  return {
    ouro: Math.floor(n / 10000),
    prata: Math.floor((n % 10000) / 100),
    bronze: n % 100,
  }
}
