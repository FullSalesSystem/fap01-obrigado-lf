// /api/ab-event: grava o teste A/B da oferta do desqualificado no Supabase.
// Arquivo IGUAL nos dois repositórios. Sistema AUXILIAR: não toca no pixel, no CRM,
// na captura de lead nem na tabela de leads.
//
// Recebe do navegador (sendBeacon) dois eventos:
//   exposed -> 1 linha por visitante (repetir a visita não duplica nem troca a versão)
//   click   -> marca o primeiro clique no botão de compra e soma os cliques
// Grava pela função public.desq_ab_registrar, que só o service_role executa.
// Segredos (Vercel > Settings > Environment Variables, só Production):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Se o Supabase falhar, responde 204 do mesmo jeito: o teste nunca atrapalha a página.

import { AB_EXPERIMENT } from '@/lib/abOferta'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/
const vazio = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
const txt = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export async function POST(req: Request) {
  let b: Record<string, unknown> = {}
  try { b = JSON.parse(await req.text()) } catch { return new Response(null, { status: 400 }) }

  const evento = txt(b.e, 10)
  const id = txt(b.id, 36).toLowerCase()
  const v = txt(b.v, 1)
  const o = txt(b.o, 5)
  const cta = txt(b.cta, 10)
  if (!['exposed', 'click'].includes(evento) || !UUID_RE.test(id) || !['A', 'B'].includes(v) || !['fap01', 'faq03'].includes(o)) {
    return new Response(null, { status: 400 })
  }
  if (cta && !['nav', 'hero', 'oferta', 'rodape', 'fixo'].includes(cta)) return new Response(null, { status: 400 })
  const email = txt(b.email, 254).toLowerCase()

  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !key) { console.error('[ab-desq] supabase_nao_configurado'); return vazio() }

  try {
    const r = await fetch(`${url}/rest/v1/rpc/desq_ab_registrar`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_experiment: AB_EXPERIMENT,
        p_evento: evento,
        p_visitor_id: id,
        p_variant: v,
        p_origem: o,
        p_cta: cta || null,
        p_sid: txt(b.sid, 80) || null,
        p_email: EMAIL_RE.test(email) ? email : null,
        p_utm_source: txt(b.us, 120) || null,
        p_utm_campaign: txt(b.uc, 200) || null,
        p_utm_content: txt(b.ut, 200) || null,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!r.ok) console.error('[ab-desq]', evento, 'http_' + r.status)
  } catch (err) {
    console.error('[ab-desq]', evento, err instanceof Error ? err.message : 'falha')
  }
  return vazio()
}
