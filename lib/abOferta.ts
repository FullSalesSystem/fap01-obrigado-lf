// Teste A/B da oferta do desqualificado: Full Sales Academy (A) x Master Sales Script (B).
// Arquivo IGUAL nos dois repositórios (fap01-obrigado-lf e faq03-obrigado-lf).
//
// Regras (molde do FAQ-05 e da fap01_ab_visitors):
// - sorteio 50/50 no navegador, guardado em localStorage: quem volta vê a mesma versão;
// - ?ab=A ou ?ab=B mostra a versão sem gravar nada (link de conferência);
// - robô (UA de crawler/headless/webdriver) vê a A e não grava;
// - só entra no teste quem chegou do formulário: a URL precisa ter ?sid= (os dois
//   formulários mandam). Sem sid (honeypot, envio rápido demais, link compartilhado,
//   acesso direto) a pessoa vê a A e não grava.
// - a gravação é do servidor (/api/ab-event, com service_role); o navegador não fala
//   com o Supabase.

export const AB_EXPERIMENT = 'desq-academy-x-mss-202611'
export const AB_STORAGE_KEY = 'fss_desq_ab_oferta'

export type Variante = 'A' | 'B'
export type Origem = 'fap01' | 'faq03'
export type Cta = 'nav' | 'hero' | 'oferta' | 'rodape' | 'fixo'

export const CHECKOUT: Record<Variante, string> = {
  A: 'https://clkdmg.site/subscribe/oto-anual-fssflix', // Full Sales Academy, anual R$ 597 (Guru)
  B: 'https://buy.fullsalessystem.com/O5E40F8F8',      // Master Sales Script, R$ 97 (Ticto)
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

function novoUuid(): string {
  const r = new Uint8Array(16)
  try { crypto.getRandomValues(r) } catch { for (let i = 0; i < 16; i++) r[i] = Math.floor(Math.random() * 256) }
  r[6] = (r[6] & 0x0f) | 0x40
  r[8] = (r[8] & 0x3f) | 0x80
  const h = Array.from(r, b => b.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function sortear(): Variante {
  const r = new Uint8Array(1)
  try { crypto.getRandomValues(r) } catch { r[0] = Math.floor(Math.random() * 256) }
  return r[0] < 128 ? 'A' : 'B'
}

export function ehRobo(): boolean {
  try {
    return /bot|crawl|spider|facebookexternalhit|headless|lighthouse|preview/i.test(navigator.userAgent) || !!navigator.webdriver
  } catch { return true }
}

export interface Sorteio {
  variante: Variante
  visitorId: string | null // null = fora do teste (não grava)
  conferencia: boolean     // aberto com ?ab=
}

// Decide a versão. Chamar só no navegador.
export function decidir(params: URLSearchParams): Sorteio {
  const forcada = params.get('ab')
  if (forcada === 'A' || forcada === 'B') return { variante: forcada, visitorId: null, conferencia: true }
  if (ehRobo() || !params.get('sid')) return { variante: 'A', visitorId: null, conferencia: false }

  let salvo: { id?: string; v?: string } = {}
  try { salvo = JSON.parse(localStorage.getItem(AB_STORAGE_KEY) || '{}') || {} } catch { /* aba anônima */ }
  // Só no computador local (conferência): ?ab_novo=1 simula uma pessoa nova. No ar é ignorado.
  if (params.get('ab_novo') === '1' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) salvo = {}
  const id = typeof salvo.id === 'string' && UUID_RE.test(salvo.id) ? salvo.id : novoUuid()
  const v: Variante = salvo.v === 'A' || salvo.v === 'B' ? salvo.v : sortear()
  try { localStorage.setItem(AB_STORAGE_KEY, JSON.stringify({ id, v, x: AB_EXPERIMENT })) } catch { /* segue sem guardar */ }
  return { variante: v, visitorId: id, conferencia: false }
}

const corta = (s: string | null, n: number) => (s ? s.slice(0, n) : '')

// Envia um evento para /api/ab-event. Nunca bloqueia a navegação nem lança erro.
export function enviarEvento(evento: 'exposed' | 'click', s: Sorteio, origem: Origem, params: URLSearchParams, cta?: Cta) {
  if (!s.visitorId) return
  const corpo = JSON.stringify({
    e: evento,
    id: s.visitorId,
    v: s.variante,
    o: origem,
    cta: cta || '',
    sid: corta(params.get('sid'), 80),
    email: corta(params.get('email'), 254).toLowerCase(),
    us: corta(params.get('utm_source'), 120),
    uc: corta(params.get('utm_campaign'), 200),
    ut: corta(params.get('utm_content'), 200),
  })
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/ab-event', new Blob([corpo], { type: 'application/json' }))) return
  } catch { /* cai no fetch */ }
  try { fetch('/api/ab-event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo, keepalive: true }).catch(() => {}) } catch { /* nada */ }
}

// Link do checkout com as UTMs do teste.
// utm_source=obrigado-lf · utm_medium=<origem> · utm_campaign=ab-oferta-desq-202611
// utm_content=<A|B> · utm_term=<utm_campaign do anúncio que trouxe o lead>
// src=desq-<origem>-<a|b> (a Ticto grava em tracking.src) · sck=<visitor_id> (tracking.sck)
// A campanha de anúncio de origem continua no lead (tabela de leads) e na linha do teste.
export function linkCheckout(s: Sorteio, origem: Origem, params: URLSearchParams): string {
  const u = new URL(CHECKOUT[s.variante])
  u.searchParams.set('utm_source', 'obrigado-lf')
  u.searchParams.set('utm_medium', origem)
  u.searchParams.set('utm_campaign', 'ab-oferta-desq-202611')
  u.searchParams.set('utm_content', s.variante)
  const campanhaAnuncio = corta(params.get('utm_campaign'), 150)
  if (campanhaAnuncio) u.searchParams.set('utm_term', campanhaAnuncio)
  u.searchParams.set('src', `desq-${origem}-${s.variante.toLowerCase()}`)
  u.searchParams.set('sck', s.visitorId || (s.conferencia ? 'conferencia' : 'fora-do-teste'))
  return u.toString()
}
