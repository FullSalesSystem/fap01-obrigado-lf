// Página do desqualificado do FAP-01: teste A/B da oferta (A = Full Sales Academy,
// B = Master Sales Script). O desenho é um só (components/PaginaOferta.tsx); o conteúdo
// de cada versão está em lib/ofertas.ts e o sorteio em lib/abOferta.ts.
import { AbOfertaProvider } from '@/components/AbOferta'
import { PaginaOferta } from '@/components/PaginaOferta'

export default function Home() {
  return (
    <AbOfertaProvider origem="fap01">
      <PaginaOferta />
    </AbOfertaProvider>
  )
}
