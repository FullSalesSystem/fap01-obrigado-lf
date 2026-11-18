'use client'
// Página do desqualificado (FAP-01 e Playbook), redesenhada em 13/11/2026 para o teste
// A/B Academy x MSS. Arquivo IGUAL nos dois repositórios. UM desenho só: as duas versões
// usam os mesmos blocos, na mesma ordem, com a mesma prova; o que muda vem de
// lib/ofertas.ts. Assim o teste mede a oferta, não o layout.
//
// Marca: vermelho da casa #FE063B (uma cor de ação só), azul-marinho #0b0e1a, Inter
// (a fonte que a página já usa), botão em pílula. Sem emoji (ícones em traço), sem
// travessão, nada que se toca nasce invisível, animação respeita prefers-reduced-motion.
// Todo botão de compra é <CheckoutLink>, que leva as UTMs do teste e registra o clique.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckoutLink, useAbOferta } from './AbOferta'

// Link do Playbook 3.0 (o mesmo do cabeçalho da playbook-obrigado-final).
const PLAYBOOK_URL = 'https://links.fullsalessystem.com/playbook'
import { OFERTAS, type Capa, type IconeNome, type Oferta } from '@/lib/ofertas'

/* ───────── prova comum às duas versões (texto da página no ar) ───────── */
const NUMEROS = [
  { n: '+R$ 900 milhões', t: 'em faturamento gerado para os clientes' },
  { n: '+700', t: 'empresas aceleradas no Brasil, Portugal e EUA' },
  { n: 'NPS 87', t: 'e nota de avaliação 9,44' },
]
const BULLETS = [
  'Mais de 700 empresas aceleradas no Brasil, Portugal e EUA em segmentos como advocacia, contabilidade, saúde e tech',
  'Mais de R$ 900 milhões em faturamento gerado para os clientes e mais de R$ 110 milhões em vendas próprias',
  'NPS de 87 e nota de avaliação 9,44 com foco em resultado real, não só em conteúdo',
  'Metodologia própria de 6 pilares que ativa todos os canais de receita da operação comercial',
]
const CLIENTES = ['ajs', 'dm', 'hotelaria', 'instituto', 'kaizen', 'maximus', 'mbi', 'mental', 'perpetuo', 'positiva', 'salvus', 'taugor', 'ticto', 'tio']
const AREAS = ['Empresarial', 'Marketing', 'Eventos', 'Médicos', 'Mentoria', 'Advocacia', 'Franquia', 'Financeiro', 'Branding', 'Serviços e Indústria', 'Comercial', 'Contábil e Tributário', 'Saúde Estética', 'SaaS', 'Energia Solar', 'Software House', 'Mercado Digital', 'Comunicação', 'Civil e Imobiliário', 'Educação']
const IMPRENSA = [
  { nome: 'Valor Econômico', src: '/oferta/imprensa/press-valor.webp', fundo: '#FFFFFF', escala: 1.2, href: 'https://valor.globo.com/patrocinado/pressworks/noticia/2025/11/24/full-sales-system-aponta-o-caminho-para-crescer-em-2026-com-estrategias-mais-inteligentes-1.ghtml' },
  { nome: 'Pequenas Empresas & Grandes Negócios', src: '/oferta/imprensa/press-pegn.webp', fundo: '#D35400', escala: 2.3, href: 'https://revistapegn.globo.com/conteudo-de-marca/pressworks/noticia/2025/11/full-sales-system-tres-mentes-empreendedoras-que-transformaram-desafios-em-estrategias-1.ghtml' },
  { nome: 'Band', src: '/oferta/imprensa/press-band.webp', fundo: '#1A1A1A', escala: 1, href: 'https://www.band.com.br/band-vale/noticias/full-sales-system-aponta-o-caminho-para-crescer-com-estrategia-inteligente-202511211836' },
  { nome: 'Estadão', src: '/oferta/imprensa/press-estadao.webp', fundo: '#FFFFFF', escala: 2, href: 'https://bluestudio.estadao.com.br/agencia-de-comunicacao/saftec-digital/full-sales-system-tres-mentes-empreendedoras-que-transformaram-desafios-em-estrategias/' },
  { nome: 'Terra', src: '/oferta/imprensa/press-terra.webp', fundo: '#FFFFFF', escala: 1, href: 'https://www.terra.com.br/economia/vendas-que-colocam-sua-empresa-no-protagonismo-full-sales-mostra-o-caminho,f72fe2c2ee9101ee76a02aea5e3eef8c69xd33kv.html' },
]

/* ───────── ícones em traço ───────── */
const ICONES: Record<IconeNome | 'check' | 'seta' | 'cadeado' | 'raio' | 'escudo' | 'relogio', ReactNode> = {
  biblioteca: <><path d="M4 4h4v16H4zM10 4h4v16h-4z" /><path d="M16 5l3.5-1 2.5 15-3.5 1z" /></>,
  call: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>,
  diagnostico: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M8.5 11h5M11 8.5v5" /></>,
  workshop: <><circle cx="12" cy="7" r="3" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /><path d="M3 11h3M18 11h3" /></>,
  calculadora: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2M8 18h2M12 18h4" /></>,
  aula: <><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M10 9l4 2-4 2z" /><path d="M8 20h8" /></>,
  prompt: <><path d="M4 5h16v11H10l-4 3.5V16H4z" /><path d="M8 9h8M8 12h5" /></>,
  ligacao: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /><path d="M15 3a6 6 0 0 1 6 6M15 6.5A2.5 2.5 0 0 1 17.5 9" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  preencher: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" /></>,
  reuniao: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5" /></>,
  check: <path d="M5 12.5l4.2 4L19 7" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  cadeado: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  raio: <path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
  escudo: <><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  relogio: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></>,
}
function Icone({ nome, tam = 24, cor = 'currentColor' }: { nome: keyof typeof ICONES; tam?: number; cor?: string }) {
  return <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONES[nome]}</svg>
}

function Titulo({ o }: { o: Oferta }) {
  const [antes, produto, meio, argumento, depois] = o.titulo
  return <h1 className="po-h1">{antes}<span className="po-red">{produto}</span>{meio}<span className="po-red">{argumento}</span>{depois}</h1>
}

function Preco({ de, por, nota, grande }: { de: string; por: string; nota: string; grande?: boolean }) {
  return (
    <div className={grande ? 'po-preco po-preco--g' : 'po-preco'}>
      <div className="po-preco-de">De <s>{de}</s> por</div>
      <div className="po-preco-por"><span>R$</span>{por}</div>
      <div className="po-preco-nota">{nota}</div>
    </div>
  )
}

function Capas({ capas, selo, lazy }: { capas: Capa[]; selo: string; lazy?: boolean }) {
  return (
    <div className={`po-capas po-capas--${capas.length}`} aria-hidden="true">
      {capas.map((c, i) => typeof c === 'string'
        ? <img key={c} src={c} alt="" width={400} height={600} className={`po-capa po-capa--${i}`} loading={lazy ? 'lazy' : undefined} fetchPriority={!lazy && i === 0 ? 'high' : 'auto'} />
        : (
          <div key={c.nome} className={`po-capa po-capa--${i} po-capa-bonus`}>
            <span className="po-capa-bonus-ic"><Icone nome={c.icone} tam={30} cor="#FE063B" /></span>
            <span className="po-capa-bonus-tag">{c.tag}</span>
            <b>{c.curto}</b>
            <span className="po-capa-bonus-marca">FULL SALES</span>
          </div>
        ))}
      <span className="po-capas-selo">{selo}</span>
    </div>
  )
}

// Prazo da condição: 24 h a partir da 1ª visita desta pessoa (guardado no navegador;
// não reinicia ao recarregar). Acabou o prazo, o cronômetro some.
const PRAZO_MS = 24 * 60 * 60 * 1000
const PRAZO_KEY = 'fss_desq_prazo'
function useContagem() {
  const [resta, setResta] = useState<number | null>(null)
  useEffect(() => {
    let inicio = Date.now()
    try {
      const salvo = Number(localStorage.getItem(PRAZO_KEY))
      if (salvo && salvo <= Date.now()) inicio = salvo
      else localStorage.setItem(PRAZO_KEY, String(inicio))
    } catch { /* sem armazenamento: conta desta visita */ }
    const tick = () => setResta(Math.max(0, inicio + PRAZO_MS - Date.now()))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])
  return resta
}
const dois = (n: number) => String(n).padStart(2, '0')
function Cronometro({ resta, compacto }: { resta: number | null; compacto?: boolean }) {
  if (!resta) return null
  const h = Math.floor(resta / 3600000), m = Math.floor((resta % 3600000) / 60000), seg = Math.floor((resta % 60000) / 1000)
  const relogio = <span className="po-crono-t">{dois(h)}:{dois(m)}:{dois(seg)}</span>
  if (compacto) return <span className="po-crono-c">Termina em {relogio}</span>
  return <div className="po-crono" role="timer"><Icone nome="relogio" tam={16} cor="#FE063B" /><span>Condição por tempo limitado. Termina em</span>{relogio}</div>
}

const ICONE_SELO: (keyof typeof ICONES)[] = ['raio', 'escudo', 'cadeado']
function Selos({ selos }: { selos: [string, string, string] }) {
  return <ul className="po-selos">{selos.map((s, i) => <li key={s}><Icone nome={ICONE_SELO[i]} tam={18} cor="rgba(255,255,255,.85)" /><span>{s}</span></li>)}</ul>
}

export function PaginaOferta() {
  const e = useAbOferta()
  const o = OFERTAS[e ? e.s.variante : 'A']
  const heroRef = useRef<HTMLElement>(null)
  const [fixoVisivel, setFixoVisivel] = useState(false)
  const resta = useContagem()

  // Barra fixa de compra no celular: aparece quando o botão da 1ª dobra sai da tela.
  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([en]) => setFixoVisivel(!en.isIntersecting), { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <main className="po">
      <style>{CSS}</style>

      <header className="po-nav">
        <div className="po-wrap po-nav-in">
          <img src="/oferta/logo-branco.webp" alt="Full Sales" width={160} height={50} className="po-logo" />
          <CheckoutLink cta="nav" className="po-btn po-btn--p">{o.ctaCurto}</CheckoutLink>
        </div>
      </header>

      {/* 1ª dobra */}
      <section className="po-hero" ref={heroRef}>
        <div className="po-wrap po-hero-in">
          <div className="po-hero-txt">
            {e?.origem === 'faq03' && <>
              <p className="po-ok"><Icone nome="check" tam={16} cor="#22C55E" /> <span>O seu Playbook foi enviado para o seu <span style={{ whiteSpace: 'nowrap' }}>e-mail.</span></span></p>
              <p className="po-olho">Ou você pode acessar <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">clicando aqui</a>. E, pelo seu perfil, a gente também tem uma oferta especial para você:</p>
            </>}
            <Titulo o={o} />
            <p className="po-apoio">{o.apoio}</p>
            <div className="po-cartao">
              <span className="po-cartao-rot">{o.precoCartao.rotulo}</span>
              <Preco de={o.precoCartao.de} por={o.precoCartao.por} nota={o.precoCartao.nota} />
              <CheckoutLink cta="hero" className="po-btn po-btn--g">{o.cta} <Icone nome="seta" tam={18} /></CheckoutLink>
              <div className="po-cartao-pe">
                <Cronometro resta={resta} />
                <Selos selos={o.selos} />
              </div>
            </div>
          </div>
          <div className="po-hero-vis"><Capas capas={o.visual.capas} selo={o.visual.selo} /></div>
        </div>
      </section>

      {/* números da Full Sales: dinheiro gerado, empresas, satisfação */}
      <section className="po-num" aria-label="A Full Sales em números">
        <div className="po-wrap po-num-in">
          {NUMEROS.map(n => <div key={n.n}><b>{n.n}</b><span>{n.t}</span></div>)}
        </div>
      </section>

      {/* o que vem */}
      <section className="po-sec po-claro">
        <div className="po-wrap">
          <h2 className="po-h2">{o.recebe.titulo}</h2>
          <p className="po-sub">{o.recebe.sub}</p>
          <div className="po-recebe">
            <article className="po-dest">
              <div className="po-dest-vis"><Capas capas={o.visual.capas} selo={o.visual.selo} lazy /></div>
              <div className="po-dest-txt">
                <span className="po-tag">{o.recebe.destaque.tag}</span>
                <h3>{o.recebe.destaque.nome}</h3>
                <p>{o.recebe.destaque.desc}</p>
              </div>
            </article>
            <div className="po-itens">
              {o.recebe.itens.map(it => (
                <article key={it.nome} className="po-item">
                  <span className="po-item-ic"><Icone nome={it.icone} tam={22} cor="#FE063B" /></span>
                  <span className="po-tag">{it.tag}</span>
                  <h3>{it.nome}</h3>
                  <p>{it.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* por dentro / como usar */}
      <section className="po-sec po-escuro">
        <div className="po-wrap">
          <p className="po-olho po-olho--red">{o.dentro.olho}</p>
          <h2 className="po-h2 po-h2--b">{o.dentro.titulo}</h2>
          <p className="po-sub po-sub--b">{o.dentro.sub}</p>
          {o.dentro.tipo === 'capas' ? (
            <div className="po-trilho" tabIndex={0} aria-label="Conteúdos do acesso">
              {o.dentro.capas.map(c => (
                <figure key={c.src}><img src={c.src} alt={c.nome} width={400} height={600} loading="lazy" /><figcaption>{c.nome}</figcaption></figure>
              ))}
            </div>
          ) : (
            <ol className="po-passos">
              {o.dentro.passos.map((p, i) => (
                <li key={p.nome}><span className="po-passo-n">{String(i + 1).padStart(2, '0')}</span><Icone nome={p.icone} tam={26} cor="#FE063B" /><b>{p.nome}</b></li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* prova: clientes e segmentos */}
      <section className="po-sec po-claro">
        <div className="po-wrap">
          <h2 className="po-h2">O mesmo método que estruturou mais de 700 operações comerciais</h2>
          <p className="po-sub">De escritórios de advocacia a empresas de tecnologia, o método funciona em qualquer segmento.</p>
        </div>
        <div className="po-marquee" aria-label="Empresas que confiam na Full Sales">
          <div className="po-marquee-tr">
            {[...CLIENTES, ...CLIENTES].map((c, i) => <span key={i} className="po-logo-cli"><img src={`/oferta/clientes/cliente-${c}.webp`} alt={i < CLIENTES.length ? `Cliente ${c}` : ''} width={136} height={48} loading="lazy" /></span>)}
          </div>
        </div>
        <div className="po-wrap">
          <ul className="po-areas" aria-label="Segmentos atendidos">{AREAS.map(a => <li key={a}>{a}</li>)}</ul>
        </div>
      </section>

      {/* oferta */}
      <section className="po-sec po-escuro" id="oferta">
        <div className="po-wrap po-oferta-wrap">
          <h2 className="po-h2 po-h2--b">Garanta agora o <span className="po-red">{o.oferta.titulo}</span></h2>
          <p className="po-sub po-sub--b">{o.oferta.sub}</p>
          <div className="po-oferta">
            <span className="po-oferta-tag">Oferta especial</span>
            <p className="po-oferta-rot">O que você recebe</p>
            <ul className="po-pilha">
              {o.oferta.pilha.map(p => <li key={p.item}><Icone nome="check" tam={18} cor="#FE063B" /><span>{p.item}</span>{p.valor && <em>{p.valor}</em>}</li>)}
            </ul>
            <Preco de={o.oferta.de} por={o.oferta.por} nota={o.oferta.nota} grande />
            <Cronometro resta={resta} />
            <CheckoutLink cta="oferta" className="po-btn po-btn--g">{o.oferta.cta} <Icone nome="seta" tam={18} /></CheckoutLink>
            <p className="po-garantia"><Icone nome="cadeado" tam={14} /> {o.oferta.garantia}</p>
          </div>
        </div>
      </section>

      {/* sócios */}
      <section className="po-sec po-claro">
        <div className="po-wrap po-sobre">
          <img src="/oferta/socios-palco.webp" alt="Vinícius de Sá, Yuri Barbosa e Matheus Garcia, sócios da Full Sales" width={1200} height={675} loading="lazy" className="po-sobre-foto" />
          <div>
            <h2 className="po-h2 po-h2--esq">A metodologia que gerou mais de <span className="po-red">R$ 900 milhões</span> para os clientes</h2>
            <p className="po-sobre-p">Fundada por Vinícius de Sá, Yuri Barbosa e Matheus Garcia, a Full Sales tem mais de 8 anos estruturando operações comerciais. {o.sobre}</p>
            <ul className="po-bul">{BULLETS.map(b => <li key={b}><Icone nome="check" tam={18} cor="#FE063B" />{b}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* imprensa */}
      <section className="po-sec po-cinza">
        <div className="po-wrap">
          <h2 className="po-h2">A Full Sales na mídia</h2>
          <ul className="po-imprensa">
            {IMPRENSA.map(p => (
              <li key={p.nome}><a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`Ler a matéria em ${p.nome}`} style={{ background: p.fundo }}>
                <img src={p.src} alt={p.nome} width={156} height={48} loading="lazy" style={{ transform: `scale(${p.escala})` }} />
              </a></li>
            ))}
          </ul>
          <p className="po-sub po-sub--p">Toque num logo para ler a matéria.</p>
        </div>
      </section>

      {/* rodapé */}
      <footer className="po-rod">
        <div className="po-wrap">
          <div className="po-faixa">
            <div><b>{o.faixa.titulo}</b><p>{o.faixa.texto}</p></div>
            <CheckoutLink cta="rodape" className="po-btn po-btn--g">{o.cta} <Icone nome="seta" tam={18} /></CheckoutLink>
          </div>
          <div className="po-legal">
            <img src="/oferta/logo-branco.webp" alt="Full Sales" width={128} height={40} loading="lazy" />
            <p>© {new Date().getFullYear()} Full Sales System. Todos os direitos reservados. CNPJ 51.843.626/0001-09</p>
            <p><a href="https://fss.fullsalessystem.com/politicas-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> · <a href="https://fss.fullsalessystem.com/termos-de-uso" target="_blank" rel="noopener noreferrer">Termos de Uso</a></p>
          </div>
        </div>
      </footer>

      {/* barra fixa no celular */}
      <div className={fixoVisivel ? 'po-fixo po-fixo--on' : 'po-fixo'} aria-hidden={!fixoVisivel}>
        <span><b>{o.fixo}</b>{resta ? <Cronometro resta={resta} compacto /> : o.produto}</span>
        <CheckoutLink cta="fixo" className="po-btn po-btn--p">{o.ctaCurto}</CheckoutLink>
      </div>
    </main>
  )
}

const CSS = `
.po{--red:#FE063B;--red-h:#c90030;--navy:#0b0e1a;--navy-2:#121729;--ink:#0d1626;--muted:#46546a;--light:#f7f8fa;--line:rgba(13,22,38,.1);--wline:rgba(255,255,255,.1);background:var(--light);color:var(--ink);overflow-x:hidden;font-family:var(--font-inter),Inter,system-ui,sans-serif}
.po *{box-sizing:border-box}
.po img{max-width:100%;height:auto;display:block}
.po-wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 20px}
.po-red{color:var(--red)}
.po-btn{white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;background:var(--red);color:#fff;font-weight:800;text-decoration:none;transition:background .2s,transform .2s;min-height:44px;text-align:center}
.po-btn:hover{background:var(--red-h)}
.po-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.po-btn--p{font-size:14px;padding:10px 20px}
.po-btn--g{white-space:normal;font-size:16px;padding:17px 22px;width:100%}
.po-nav{position:sticky;top:0;z-index:50;background:rgba(11,14,26,.94);border-bottom:1px solid var(--wline)}
.po-nav-in{height:64px;display:flex;align-items:center;justify-content:space-between}
.po .po-logo{width:auto;height:32px}
.po-hero{background:var(--navy);color:#fff;padding:28px 0 52px;border-bottom:1px solid var(--wline)}
.po-hero-in{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
.po-ok{display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.35);color:#d1fae5;font-size:13px;font-weight:700;padding:6px 14px;border-radius:999px;margin-bottom:14px}
.po-olho{font-size:14px;color:rgba(255,255,255,.6);margin-bottom:10px}
.po-hero .po-olho{font-size:15px;line-height:1.5;color:rgba(255,255,255,.78);margin-bottom:14px;max-width:600px}
.po-hero .po-olho a{color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:3px}
.po-olho--red{color:var(--red);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:12px;text-align:center}
.po-h1{font-size:clamp(27px,3.4vw,42px);line-height:1.12;font-weight:900;letter-spacing:-.025em;margin:0 0 16px}
.po-apoio{font-size:clamp(15px,1.4vw,17px);line-height:1.6;color:rgba(255,255,255,.72);max-width:600px;margin:0 0 22px}
.po-cartao{position:relative;background:var(--navy-2);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:26px 22px 0;max-width:440px}
.po-cartao-pe{margin:18px -22px 0;padding:14px 16px 16px;border-top:1px solid var(--wline);display:flex;flex-direction:column;gap:14px}
.po-cartao-rot{position:absolute;top:-12px;left:22px;background:var(--red);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 12px;border-radius:999px}
.po-preco{margin-bottom:18px}
.po-preco-de{font-size:14px;color:rgba(255,255,255,.55)}
.po-preco-por{font-size:52px;font-weight:900;line-height:1.05;letter-spacing:-.03em}
.po-preco-por span{font-size:20px;font-weight:700;vertical-align:top;margin-right:4px;position:relative;top:10px}
.po-preco-nota{font-size:13px;color:rgba(255,255,255,.6)}
.po-preco--g{text-align:center;margin:22px 0 14px}
.po-oferta .po-crono{margin-bottom:16px}
.po-preco--g .po-preco-por{font-size:clamp(56px,9vw,76px)}
.po-selos{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0;padding:0}
.po-selos li{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:12px;font-weight:600;line-height:1.3;color:rgba(255,255,255,.78);padding:0 6px}
.po-selos li+li{border-left:1px solid var(--wline)}
.po-crono{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 8px;font-size:13px;color:rgba(255,255,255,.82);background:rgba(254,6,59,.1);border:1px solid rgba(254,6,59,.35);border-radius:10px;padding:8px 12px;text-align:center}
.po-crono-t{font-variant-numeric:tabular-nums;font-weight:800;color:#fff;letter-spacing:.04em}
.po-crono-c{font-size:12px;color:rgba(255,255,255,.7)}
.po-crono-c .po-crono-t{font-size:12px}
.po-hero-vis{display:flex;justify-content:center}
.po-capas{position:relative;width:min(100%,340px);aspect-ratio:4/5}
.po-capa{position:absolute;width:62%;border-radius:12px;box-shadow:0 16px 30px -18px rgba(0,0,0,.7);border:1px solid var(--wline)}
.po-capa-bonus{aspect-ratio:2/3;background:#161c33;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:18px 16px;color:#fff;overflow:hidden}
.po-capa-bonus-ic{display:flex;width:52px;height:52px;align-items:center;justify-content:center;border-radius:14px;border:1px solid rgba(254,6,59,.5);margin-bottom:6px}
.po-capa-bonus-tag{white-space:nowrap;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--red)}
.po-capa-bonus b{font-size:15px;font-weight:900;line-height:1.2;text-transform:uppercase}
.po-capa-bonus-marca{position:absolute;bottom:14px;left:16px;font-size:9px;font-weight:800;letter-spacing:.2em;color:rgba(255,255,255,.4)}
.po-capas--1 .po-capa--0{left:19%;top:4%;width:64%;transform:rotate(-3deg)}
.po-capas--3 .po-capa--0{left:19%;top:2%;z-index:3}
.po-capas--3 .po-capa--1{left:-6%;top:10%;transform:rotate(-8deg);z-index:2}
.po-capas--3 .po-capa--2{right:-6%;top:10%;transform:rotate(8deg);z-index:1}
.po-capas--3 .po-capa--1.po-capa-bonus{padding:18px 46% 18px 14px}
.po-capas--3 .po-capa--2.po-capa-bonus{padding:18px 14px 18px 46%;align-items:flex-end;text-align:right}
.po-capas--3 .po-capa-bonus b{display:none}
.po-capas--3 .po-capa--2 .po-capa-bonus-marca{left:auto;right:16px}
.po-capas-selo{position:absolute;right:4%;bottom:6%;z-index:4;background:var(--red);color:#fff;font-weight:900;font-size:18px;padding:10px 16px;border-radius:14px}
.po-num{background:var(--navy-2);color:#fff;border-top:1px solid var(--wline)}
.po-num-in{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:22px;padding-bottom:22px}
.po-num-in div{display:flex;flex-direction:column;gap:2px;padding-left:14px;border-left:2px solid var(--red)}
.po-num b{font-size:22px;font-weight:900}
.po-num span{font-size:13px;color:rgba(255,255,255,.62);line-height:1.4}
.po-sec{padding:72px 0}
.po-claro{background:#fff}
.po-cinza{background:var(--light)}
.po-escuro{background:var(--navy);color:#fff}
.po-h2{font-size:clamp(25px,3.4vw,38px);line-height:1.15;font-weight:850;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 auto 12px;max-width:820px}
.po-h2--b{color:#fff}
.po-h2--esq{text-align:left;margin-left:0}
.po-sub{text-align:center;color:var(--muted);font-size:16px;line-height:1.6;max-width:640px;margin:0 auto 36px}
.po-sub--b{color:rgba(255,255,255,.65)}
.po-sub--p{margin:18px auto 0;font-size:14px}
.po-recebe{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:18px}
.po-dest{background:var(--navy);color:#fff;border-radius:20px;overflow:hidden;display:flex;flex-direction:column}
.po-dest-vis{display:flex;justify-content:center;padding:28px 20px 4px}
.po-dest-vis .po-capas{width:min(100%,300px)}
.po-dest-txt{padding:14px 22px 24px}
.po-dest h3{font-size:21px;font-weight:800;margin:6px 0 8px}
.po-dest p{color:rgba(255,255,255,.72);font-size:15px;line-height:1.55;margin:0}
.po-itens{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.po-item{border:1px solid var(--line);border-radius:18px;padding:20px;background:var(--light)}
.po-item-ic{display:flex;width:42px;height:42px;align-items:center;justify-content:center;border-radius:12px;background:#fff;border:1px solid var(--line);margin-bottom:12px}
.po-item h3{font-size:16px;font-weight:800;margin:6px 0 6px;line-height:1.3}
.po-item p{color:var(--muted);font-size:14px;line-height:1.5;margin:0}
.po-tag{font-size:11px;font-weight:800;color:var(--red);text-transform:uppercase;letter-spacing:.1em}
.po-trilho{display:grid;grid-auto-flow:column;grid-auto-columns:150px;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 14px;scrollbar-width:thin}
.po-trilho figure{margin:0;scroll-snap-align:start}
.po-trilho img{border-radius:10px;border:1px solid var(--wline)}
.po-trilho figcaption{font-size:12px;color:rgba(255,255,255,.75);margin-top:8px;line-height:1.35}
.po-passos{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.po-passos li{background:var(--navy-2);border:1px solid var(--wline);border-radius:18px;padding:22px 18px;display:flex;flex-direction:column;gap:12px;position:relative}
.po-passo-n{position:absolute;top:18px;right:18px;font-size:12px;font-weight:800;color:rgba(255,255,255,.35);letter-spacing:.1em}
.po-passos b{font-size:16px;line-height:1.35}
.po-marquee{overflow:hidden;margin:4px 0 28px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.po-marquee-tr{display:flex;gap:12px;width:max-content;animation:po-mq 40s linear infinite}
@keyframes po-mq{to{transform:translateX(calc(-50% - 6px))}}
.po-logo-cli{width:150px;height:68px;border:1px solid var(--line);border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;padding:10px}
.po-logo-cli img{width:100%;height:100%;object-fit:contain}
.po-areas{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.po-areas li{font-size:13px;font-weight:600;padding:7px 14px;border-radius:999px;background:var(--light);border:1px solid var(--line);color:var(--ink)}
.po-oferta-wrap{max-width:720px}
.po-oferta{position:relative;background:var(--navy-2);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:34px clamp(20px,4vw,40px) 26px}
.po-oferta-tag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--red);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:5px 14px;border-radius:999px;white-space:nowrap}
.po-oferta-rot{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.85);margin:0 0 14px}
.po-pilha{list-style:none;padding:0 0 20px;margin:0;display:flex;flex-direction:column;gap:12px;border-bottom:1px solid var(--wline)}
.po-pilha li{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:start;font-size:15px;line-height:1.5;color:rgba(255,255,255,.85)}
.po-pilha svg{margin-top:2px}
.po-pilha em{font-style:normal;color:rgba(255,255,255,.5);font-size:14px;white-space:nowrap}
.po-garantia{display:flex;align-items:center;justify-content:center;gap:6px;margin:14px 0 0;font-size:13px;color:rgba(255,255,255,.55);text-align:center}
.po-sobre{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.po-sobre-foto{border-radius:20px;width:100%;aspect-ratio:16/10;object-fit:cover;box-shadow:0 20px 50px -24px rgba(13,22,38,.5)}
.po-sobre-p{color:var(--muted);font-size:16px;line-height:1.65;margin:0 0 20px}
.po-bul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
.po-bul li{display:grid;grid-template-columns:20px 1fr;gap:10px;font-size:14px;line-height:1.5;color:var(--muted)}
.po-bul svg{margin-top:1px}
.po-imprensa{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.po-imprensa a{display:flex;align-items:center;justify-content:center;width:170px;height:68px;border-radius:12px;border:1px solid var(--line);overflow:hidden;padding:12px;transition:transform .2s}
.po-imprensa a:hover{transform:translateY(-2px)}
.po-imprensa img{width:100%;height:100%;object-fit:contain}
.po-rod{background:#07090f;color:#fff;padding:56px 0 110px}
.po-faixa{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;background:var(--navy-2);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:26px 28px;margin-bottom:40px}
.po-faixa > div{flex:1 1 320px}
.po-faixa b{font-size:20px;font-weight:800}
.po-faixa p{color:rgba(255,255,255,.62);font-size:14px;line-height:1.55;margin:6px 0 0}
.po-faixa .po-btn--g{width:auto}
.po-legal{display:flex;flex-direction:column;align-items:flex-start;gap:8px;font-size:13px;color:rgba(255,255,255,.45)}
.po .po-legal img{height:30px;width:auto;margin-bottom:6px}
.po-legal a{color:rgba(255,255,255,.6);text-decoration:none}
.po-legal p{margin:0}
.po-fixo{position:fixed;left:0;right:0;bottom:0;z-index:60;display:none;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:rgba(11,14,26,.97);border-top:1px solid var(--wline);color:#fff;transform:translateY(110%);transition:transform .25s}
.po-fixo span{display:flex;flex-direction:column;font-size:12px;color:rgba(255,255,255,.6);line-height:1.3}
.po-fixo b{font-size:17px;color:#fff}
.po-fixo--on{transform:none}
@media (min-width:901px){
  .po-cartao{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:22px;max-width:560px}
  .po-cartao-pe{grid-column:1 / -1}
  .po-cartao .po-preco{margin:0}
}
@media (max-width:900px){
  .po-hero-in{grid-template-columns:1fr;gap:28px}
  .po-hero-vis{order:2}
  .po-capas{width:min(62%,230px)}
  .po-recebe{grid-template-columns:1fr}
  .po-passos{grid-template-columns:repeat(2,minmax(0,1fr))}
  .po-sobre{grid-template-columns:1fr;gap:28px}
  .po-fixo{display:flex}
}
@media (max-width:560px){
  .po-hero{padding:24px 0 40px}
  .po-cartao{max-width:none}
  .po-num-in{grid-template-columns:1fr;gap:12px}
  .po-sec{padding:56px 0}
  .po-itens{grid-template-columns:1fr}
  .po-passos{grid-template-columns:1fr}
  .po-faixa .po-btn--g{width:100%}
  .po-nav .po-btn--p{padding:9px 14px;font-size:13px}
  .po-imprensa li{width:calc(50% - 6px)}
  .po-imprensa a{width:100%}
}
@media (prefers-reduced-motion:reduce){
  .po-marquee-tr{animation:none;flex-wrap:wrap;width:auto;justify-content:center}
  .po-btn,.po-fixo,.po-imprensa a{transition:none}
}
`
