'use client'
// Página do desqualificado do FAP-01: teste A/B da oferta (A = Full Sales Academy,
// B = Master Sales Script). O desenho é um só (components/PaginaOferta.tsx); o conteúdo
// de cada versão está em lib/ofertas.ts e o sorteio em lib/abOferta.ts.
// Com ?motivo= (régua de 24/11/2026, app/motivo.tsx): o texto do motivo entra logo
// abaixo do logo, antes da oferta do A/B. nicho-analise com token: texto + formulário
// extra, SEM oferta e sem entrar no A/B.
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AbOfertaProvider } from '@/components/AbOferta'
import { PaginaOferta } from '@/components/PaginaOferta'
import { AnalisePage, MotivoSection, lerMotivo } from './motivo'

function Conteudo() {
  const params = useSearchParams()
  let motivo = lerMotivo(params.get('motivo'))
  const token = params.get('t') || ''
  if (motivo === 'nicho-analise') {
    if (token) return <AnalisePage token={token} />
    motivo = 'nicho' // sem token não dá pra mandar o formulário: texto de nicho com a oferta
  }
  return (
    <AbOfertaProvider origem="fap01">
      <PaginaOferta topo={motivo ? <MotivoSection motivo={motivo} /> : undefined} />
    </AbOfertaProvider>
  )
}

export default function Home() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  )
}
