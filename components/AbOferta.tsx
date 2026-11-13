'use client'
// Teste A/B da oferta do desqualificado. Arquivo IGUAL nos dois repositórios.
// <AbOfertaProvider> decide a versão no navegador e só então mostra a página
// (sem piscar a A para quem caiu na B). <SoA>/<SoB> mostram o bloco de cada versão.
// <CheckoutLink> é o botão de compra: leva ao checkout da versão com as UTMs do
// teste e registra o clique.

import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { decidir, enviarEvento, linkCheckout, type Cta, type Origem, type Sorteio } from '@/lib/abOferta'

interface Estado { s: Sorteio; origem: Origem; params: URLSearchParams }
const Ctx = createContext<Estado | null>(null)

export function AbOfertaProvider({ origem, children }: { origem: Origem; children: ReactNode }) {
  const [estado, setEstado] = useState<Estado | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = decidir(params)
    setEstado({ s, origem, params })
    enviarEvento('exposed', s, origem, params)
    // Marca a versão para o pixel/GTM sem criar evento novo no Meta.
    try { (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'ab_oferta_desq', ab_variante: s.variante, ab_origem: origem }) } catch { /* sem GTM */ }
  }, [origem])

  if (!estado) return <div style={{ minHeight: '100vh', background: '#060A1E' }} aria-busy="true" />
  return <Ctx.Provider value={estado}>{children}</Ctx.Provider>
}

export function useAbOferta() {
  return useContext(Ctx)
}

export function SoA({ children }: { children: ReactNode }) {
  const e = useAbOferta()
  return e && e.s.variante === 'A' ? <>{children}</> : null
}

export function SoB({ children }: { children: ReactNode }) {
  const e = useAbOferta()
  return e && e.s.variante === 'B' ? <>{children}</> : null
}

export function CheckoutLink({ cta, className, style, children }: { cta: Cta; className?: string; style?: CSSProperties; children: ReactNode }) {
  const e = useAbOferta()
  const href = useMemo(() => (e ? linkCheckout(e.s, e.origem, e.params) : '#'), [e])
  return (
    <a
      href={href}
      className={className}
      style={style}
      data-ab-cta={cta}
      onClick={() => { if (e) enviarEvento('click', e.s, e.origem, e.params, cta) }}
    >
      {children}
    </a>
  )
}
