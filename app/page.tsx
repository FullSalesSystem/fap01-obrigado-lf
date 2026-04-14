'use client'

import { useState, useEffect, useRef, Suspense, ReactNode } from 'react'
import Image from 'next/image'

// ─── CONFIGURAR ESTES VALORES ──────────────────────────────────────────────────
const CHECKOUT_ANUAL_URL  = 'https://clkdmg.site/subscribe/oto-anual-fssflix'
const CHECKOUT_MENSAL_URL = 'https://clkdmg.site/subscribe/oto-mensal-fssflix'
const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLzJ4B1s6bJZ2DL9jhvEgx2ANhwi6LiQk_'
// ──────────────────────────────────────────────────────────────────────────────

/* ────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(entry.target) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function FadeUp({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
function IconArrow() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function IconYouTube() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
}
function IconCheck() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="10" fill="rgba(224,21,21,0.1)"/><path d="M6 10.5L8.8 13L14 7" stroke="#E01515" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/* ─────────────────────────────────────────────
   NAVBAR — começa sobre fundo escuro
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  // hero section height ≈ 100vh; após passar disso o fundo fica claro
  const DARK_HERO_PX = 560
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > DARK_HERO_PX)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
      backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(10,10,10,0.6)',
      backdropFilter: 'blur(14px)',
      transition: 'all 0.35s',
    }}>
      <div className="section-container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logo-fss.png" alt="Full Sales System" style={{ height: 36, width: 'auto', display: 'block', filter: scrolled ? 'none' : 'brightness(0) invert(1)' }} />
        <a
          href={CHECKOUT_ANUAL_URL}
          className="btn-primary"
          style={{ fontSize: 13, padding: '9px 20px' }}
        >
          Garantir Acesso <IconArrow />
        </a>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────
   ACADEMY HERO — dark, com pricing
───────────────────────────────────────────── */
function AcademyHeroSection() {
  return (
    <section style={{ paddingTop: 96, paddingBottom: 96, position: 'relative', overflow: 'hidden', backgroundImage: 'url(/background-fss.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* overlay escuro sobre o background */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,30,0.72)', pointerEvents: 'none' }} />

      <div className="section-container" style={{ position: 'relative', maxWidth: 860, textAlign: 'center' }}>
        <FadeUp>
          {/* eyebrow */}
          <div style={{ marginBottom: 20, fontSize: 'clamp(11px, 1.4vw, 13px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            AULAS&nbsp;&nbsp;•&nbsp;&nbsp;FRAMEWORKS&nbsp;&nbsp;•&nbsp;&nbsp;PLAYBOOKS
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 'clamp(13px, 1.4vw, 17px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0',
              lineHeight: 1.5,
              marginBottom: 10,
            }}>
              Se sua empresa ainda não alcança R$50 mil mensais...
            </p>
            <h1 style={{
              fontSize: 'clamp(20px, 2.8vw, 38px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              margin: 0,
            }}>
              o{' '}
              <span style={{ color: '#E01515' }}>Full Sales Academy</span>
              {' '}é o upgrade que você precisa para potencializar seus resultados
            </h1>
          </div>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.65,
            maxWidth: 640,
            margin: '0 auto 52px',
          }}>
            Uma plataforma completa com todo o conteúdo que já estruturou o comercial de mais de{' '}
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>600 empresas</span>
            {' '}— aprenda a construir um sistema comercial com previsibilidade, escala e liberdade.
          </p>

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 560, margin: '0 auto 40px' }}>

            {/* Anual */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(224,21,21,0.18) 0%, rgba(30,82,232,0.12) 100%)',
              border: '1px solid rgba(224,21,21,0.45)',
              borderRadius: 18,
              padding: '32px 24px 24px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                background: '#E01515', color: '#fff', fontSize: 11, fontWeight: 800,
                padding: '4px 16px', borderRadius: 100, letterSpacing: '0.06em',
                whiteSpace: 'nowrap', textTransform: 'uppercase',
              }}>
                Melhor valor
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Acesso Anual</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, justifyContent: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', alignSelf: 'flex-start', marginTop: 8 }}>R$</span>
                <span style={{ fontSize: 'clamp(42px, 7vw, 54px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>597</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>à vista · equivale a R$49,75/mês</div>
              <a href={CHECKOUT_ANUAL_URL} className="btn-primary" style={{ width: '100%', fontSize: 14, padding: '13px 16px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' as const }}>
                Garantir Acesso Anual <IconArrow />
              </a>
            </div>

            {/* Parcelado */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: '32px 24px 24px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Acesso Parcelado</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, justifyContent: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>12× de</span>
                <span style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 900, color: '#E01515', lineHeight: 1, marginLeft: 6 }}>R$97</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>no cartão de crédito</div>
              <a
                href={CHECKOUT_MENSAL_URL}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', fontSize: 14, padding: '13px 16px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700,
                  textDecoration: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
                }}
              >
                Parcelar em 12× <IconArrow />
              </a>
            </div>
          </div>

          {/* micro trust */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {['Acesso imediato', '+600 empresas estruturadas'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="rgba(224,21,21,0.2)"/><path d="M4 7.2L6.1 9.2L10 5" stroke="#E01515" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      <style>{`@media(max-width:540px){#academy-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}


/* ─────────────────────────────────────────────
   QUEM CONFIA NA FSS
───────────────────────────────────────────── */

const clientLogos = [
  { src: '/cliente-ajs.png',       name: 'AJS' },
  { src: '/cliente-dm.png',        name: 'DM' },
  { src: '/cliente-hotelaria.png', name: 'Hotelaria' },
  { src: '/cliente-instituto.png', name: 'Instituto' },
  { src: '/cliente-kaizen.png',    name: 'Kaizen' },
  { src: '/cliente-maximus.png',   name: 'Maximus' },
  { src: '/cliente-mbi.png',       name: 'MBI' },
  { src: '/cliente-mental.png',    name: 'Mental One' },
  { src: '/cliente-perpetuo.png',  name: 'Perpétuo' },
  { src: '/cliente-positiva.png',  name: 'Positiva' },
  { src: '/cliente-salvus.png',    name: 'Salvus' },
  { src: '/cliente-taugor.png',    name: 'Taugor' },
  { src: '/cliente-ticto.png',     name: 'Ticto' },
  { src: '/cliente-tio.png',       name: 'Tio' },
]
const areas1 = [
  { icon: '🏢', text: 'Empresarial' },
  { icon: '📢', text: 'Marketing' },
  { icon: '🎤', text: 'Eventos' },
  { icon: '⚕️', text: 'Médicos' },
  { icon: '💡', text: 'Mentoria / Consultoria' },
  { icon: '⚖️', text: 'Advocacia' },
  { icon: '🏪', text: 'Franquia' },
  { icon: '💰', text: 'Financeiro' },
  { icon: '🎨', text: 'Branding / Posicionamento' },
  { icon: '🏭', text: 'Serviços / Indústria' },
]
const areas2 = [
  { icon: '💬', text: 'Comercial' },
  { icon: '📊', text: 'Contábil / Tributário' },
  { icon: '💆', text: 'Saúde Estética' },
  { icon: '☁️', text: 'SAAS (Software as Service)' },
  { icon: '⚡', text: 'Energia Solar' },
  { icon: '💻', text: 'Software House' },
  { icon: '📱', text: 'Mercado Digital' },
  { icon: '📡', text: 'Comunicação' },
  { icon: '🏗️', text: 'Civil / Imobiliário' },
  { icon: '🎓', text: 'Educação' },
]

function TrustSection() {
  return (
    <section className="section-pad" style={{ background: '#FFFFFF' }}>
      <div className="section-container">
        <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#0A0A0A', lineHeight: 1.12 }}>
            +550 empresas já atuaram com a Full Sales System
          </h2>
          <p style={{ color: '#6B7280', fontSize: 16, marginTop: 12, maxWidth: 520, margin: '12px auto 0' }}>
            De escritórios de advocacia a empresas de tecnologia, em todos os segmentos
          </p>
        </FadeUp>
        <FadeUp delay={80}>
          <div style={{ overflow: 'hidden', marginBottom: 56, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #fff, transparent)', zIndex: 1, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #fff, transparent)', zIndex: 1, pointerEvents: 'none' }} />
            <div className="marquee-track">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div key={i} style={{ flexShrink: 0, width: 160, height: 72, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginRight: 12 }}>
                  <Image src={logo.src} alt={logo.name} width={136} height={48} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={120}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: '#0A0A0A', marginBottom: 6 }}>
              Áreas que <strong>já atuamos</strong>
            </h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>Independente do segmento, o sistema funciona.</p>
          </div>
          <style>{`
            @keyframes fss-left { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 8px)); } }
            @keyframes fss-right { 0% { transform: translateX(calc(-50% - 8px)); } 100% { transform: translateX(0); } }
            .fss-row { display:flex; gap:14px; width:max-content; }
            .fss-row-1 { animation: fss-left 28s linear infinite; }
            .fss-row-2 { animation: fss-right 28s linear infinite; }
            .fss-overflow { overflow:hidden; width:100%; position:relative; padding: 6px 0; }
            .fss-card { display:inline-flex; align-items:center; gap:10px; background:#1a1a1a; color:#fff; padding:12px 20px; border-radius:10px; white-space:nowrap; flex-shrink:0; font-size:14px; font-weight:500; }
          `}</style>
          <div className="fss-overflow">
            <div className="fss-row fss-row-1">
              {[...areas1, ...areas1].map((a, i) => (
                <div key={i} className="fss-card"><span>{a.icon}</span><span>{a.text}</span></div>
              ))}
            </div>
          </div>
          <div className="fss-overflow" style={{ marginTop: 12 }}>
            <div className="fss-row fss-row-2">
              {[...areas2, ...areas2].map((a, i) => (
                <div key={i} className="fss-card"><span>{a.icon}</span><span>{a.text}</span></div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SOBRE A FSS
───────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="section-pad" style={{ position: 'relative', overflow: 'hidden', backgroundImage: 'url(/background-fss.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,30,0.80)', pointerEvents: 'none' }} />
      <div className="section-container" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          {/* Photo */}
          <FadeUp>
            <div style={{
              width: '100%', maxWidth: 420, aspectRatio: '4/5',
              borderRadius: 16, position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
            }}>
              <Image
                src="/socios.png"
                alt="Sócios FSS"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 24, right: 24, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#4ADE80' }}>R$30M</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>no 2º ano</div>
              </div>
            </div>
          </FadeUp>

          {/* Bio */}
          <FadeUp delay={120}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#FFFFFF', lineHeight: 1.14, marginBottom: 16 }}>
              A Full Sales System é uma empresa de{' '}
              <span style={{ color: '#E01515' }}>estruturação comercial</span>, não de cursos
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
              Fundada por Vinícius de Sá, Yuri Barbosa e Matheus Garcia, a Full Sales System é uma consultoria especializada em equipes comerciais que ajuda empresas a otimizarem o ROI de seus funis de vendas. Com mais de 8 anos de experiência, a FSS acumula mais de 550 empresas aceleradas, mais de R$110 milhões em vendas próprias e mais de R$1 bilhão em faturamento gerado para seus clientes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                'Mais de 550 empresas aceleradas no Brasil, Portugal e EUA em segmentos como advocacia, contabilidade, saúde e tech',
                'Mais de R$1 bilhão em faturamento gerado para empresas aceleradas e mais de R$110 milhões em vendas próprias',
                'NPS de 87 e nota de avaliação 9,44 com foco em resultado real, não só em conteúdo',
                'Metodologia própria de 6 pilares que ativa todos os canais de receita da operação comercial',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <IconCheck />
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: '+8 anos', desc: 'de experiência' },
                { label: '+550 empresas', desc: 'estruturadas' },
                { label: 'Brasil · Portugal · EUA', desc: 'atuação global' },
              ].map(t => (
                <div key={t.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SESSÃO DE IMPRENSA
───────────────────────────────────────────── */

const pressItems = [
  {
    outlet: 'Estadão',
    title: 'Full Sales System: três mentes empreendedoras que transformaram desafios em estratégias',
    quote: 'Nos últimos anos, ajudamos os nossos clientes a girar mais de 500 milhões de faturamento em vendas. Mas quando olhamos para esses números enxergamos algo ainda maior: não foi só o aumento nas vendas, mas eles se tornaram protagonistas da própria empresa.',
    logo: '/estadao-novo.png',
    logoBg: '#FFFFFF',
  },
  {
    outlet: 'Valor Econômico',
    title: 'Full Sales System aponta o caminho para crescer em 2026 com estratégias mais inteligentes',
    quote: 'Empresas que adotam estruturas de vendas inteligentes e estratégias orgânicas robustas tendem a prosperar em cenários de incerteza, criando vantagem competitiva mesmo com menor investimento direto em mídia.',
    logo: '/press-valor-economico.png',
    logoBg: '#FFFFFF',
  },
  {
    outlet: 'Pequenas Empresas & Grandes Negócios',
    title: 'Yuri Barbosa, Vinícius de Sá e Matheus Garcia trilharam caminhos distintos, mas marcados pelo mesmo ponto de virada',
    quote: 'Os sócios desenvolveram uma metodologia própria, capaz de integrar processos comerciais eficientes, automação estratégica e construção de autoridade digital. O objetivo não era apenas aumentar vendas, mas criar um modelo de crescimento consistente.',
    logo: '/press-pequenas-empresas.png',
    logoBg: '#D35400',
  },
]

const pressLogos = [
  { name: 'Valor Econômico', src: '/press-valor-economico.png', bg: '#FFFFFF', scale: 1.2 },
  { name: 'Pequenas Empresas & Grandes Negócios', src: '/press-pequenas-empresas.png', bg: '#D35400', scale: 2.3 },
  { name: 'Band', src: '/press-band.png', bg: '#1A1A1A', scale: 1 },
  { name: 'Estadão', src: '/estadao-novo.png', bg: '#FFFFFF', scale: 2.0 },
  { name: 'Terra', src: '/press-terra.png', bg: '#FFFFFF', scale: 1.0 },
]

function PressSection() {
  return (
    <section className="section-pad" style={{ background: '#FFFFFF' }}>
      <div className="section-container">
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#0A0A0A', lineHeight: 1.12 }}>
            Full Sales System na Mídia
          </h2>
          <p style={{ color: '#6B7280', fontSize: 16, marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
            Como a imprensa fala sobre a metodologia da Full Sales System
          </p>
        </FadeUp>

        {/* Press logos strip — desktop: flex wrap | mobile: marquee */}
        <FadeUp delay={60}>
          {/* Desktop */}
          <div id="press-logos-desktop" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            {pressLogos.map((logo, i) => (
              <div key={i} style={{ height: 72, width: 180, background: logo.bg, border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Image src={logo.src} alt={logo.name} width={156} height={48} style={{ objectFit: 'contain', width: '100%', height: '100%', transform: `scale(${logo.scale})`, transformOrigin: 'center center' }} />
              </div>
            ))}
          </div>
          {/* Mobile: marquee carousel */}
          <div id="press-logos-mobile" style={{ overflow: 'hidden', marginBottom: 48, position: 'relative', display: 'none' }}>
            <div className="marquee-track" style={{ animationDuration: '18s' }}>
              {[...pressLogos, ...pressLogos].map((logo, i) => (
                <div key={i} style={{ flexShrink: 0, height: 64, width: 150, background: logo.bg, border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginRight: 12 }}>
                  <Image src={logo.src} alt={logo.name} width={130} height={44} style={{ objectFit: 'contain', width: '100%', height: '100%', transform: `scale(${logo.scale})`, transformOrigin: 'center center' }} />
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Press quote cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {pressItems.map((item, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div className="card" style={{ padding: '28px 26px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 32, color: '#E01515', fontWeight: 900, lineHeight: 1, marginBottom: 10, fontFamily: 'Georgia, serif' }}>"</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.4, marginBottom: 12 }}>
                  {item.title}
                </p>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic', flexGrow: 1 }}>
                  {item.quote}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>{item.outlet}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #press-logos-desktop { display: none !important; }
          #press-logos-mobile { display: block !important; }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER (dark)
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 40px' }}>
      <div className="section-container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 40, marginBottom: 48 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src="/logo-fss.png" alt="Full Sales System" style={{ height: 40, width: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.65 }}>
              Estruturação comercial para empresas que já faturam e querem crescer com processo e previsibilidade.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#71717A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Academy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={CHECKOUT_ANUAL_URL} style={{ fontSize: 14, color: '#A1A1AA', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>Garantir Acesso Anual — R$597</a>
                <a href={CHECKOUT_MENSAL_URL} style={{ fontSize: 14, color: '#A1A1AA', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>Parcelar em 12× de R$97</a>
                <a href={YOUTUBE_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#A1A1AA', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>YouTube — Comercial Faixa Preta</a>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA strip */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(224,21,21,0.1) 0%, rgba(30,82,232,0.08) 100%)',
          border: '1px solid rgba(224,21,21,0.2)',
          borderRadius: 14, padding: '26px 32px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 36,
        }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 4 }}>Garanta seu acesso ao Full Sales Academy</p>
            <p style={{ fontSize: 13, color: '#A1A1AA' }}>R$597/ano à vista ou 12× de R$97 no cartão.</p>
          </div>
          <a href={CHECKOUT_ANUAL_URL} className="btn-primary" style={{ fontSize: 14, padding: '14px 24px' }}>
            Garantir Acesso <IconArrow />
          </a>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 13, color: '#52525B' }}>© {new Date().getFullYear()} Full Sales System. Todos os direitos reservados. CNPJ 51.843.626/0001-09</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <a href="https://fss.fullsalessystem.com/politicas-de-privacidade" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#52525B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')} onMouseLeave={e => (e.currentTarget.style.color = '#52525B')}>Política de Privacidade</a>
              <a href="https://fss.fullsalessystem.com/termos-de-uso" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#52525B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#A1A1AA')} onMouseLeave={e => (e.currentTarget.style.color = '#52525B')}>Termos de Uso</a>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#52525B' }}>Feito para empresários que constroem de verdade.</p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
function HomeContent() {
  return (
    <main style={{ backgroundColor: '#FFFFFF', color: '#0A0A0A', overflowX: 'hidden' }}>
      <Navbar />
      <AcademyHeroSection />
      <TrustSection />
      <AboutSection />
      <PressSection />
      <Footer />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
