'use client'

/* Motivo da desqualificação (contrato 24/11/2026, crm-pre-vendas-fss/CONTRATO-funis-nicho-2026-11-24.md).
   ?motivo=nicho|faturamento|cargo -> texto antes da oferta atual.
   ?motivo=nicho-analise&t=<token> -> texto 4 + formulário extra, sem oferta. O token é cifrado
   pelo /api/lead do fap01 (sem e-mail/telefone legível); quem chega sem token vê o texto de nicho.
   Textos aprovados pelo Matheus em 24/11/2026 (textos-desqualificado.md), literais. */

import { useState, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'

export const ANALISE_URL = 'https://fap01.fullsalessystem.com/api/lead-analise'

export type Motivo = 'nicho' | 'faturamento' | 'cargo' | 'nicho-analise'

const TEXTOS: Record<Motivo, { titulo: string; paragrafos: string[] }> = {
  nicho: {
    titulo: 'Seu negócio vende de um jeito diferente do que a gente sabe instalar.',
    paragrafos: [
      'O nosso trabalho é montar o comercial de empresas que vendem por conversa: o lead chega pelo marketing, o pré-vendas qualifica, o closer fecha numa call. É assim que a gente faz há três anos, em mais de 950 empresas, e é onde a gente sabe entregar resultado.',
      'Indústria e varejo giram por outro motor. Representante, distribuidor, ponto de venda, mix de produto, giro de estoque. A gente entende desse jogo, mas não é nele que a gente entrega o nosso melhor. E pegar um projeto sabendo disso seria vender uma promessa que a gente não sabe cumprir.',
      'Então, por enquanto, a resposta honesta é essa: não é com a gente. Se você tem uma operação de venda consultiva rodando junto (uma linha de serviço, um produto que fecha em reunião), vale conversar de novo.',
      'Enquanto isso, se quiser começar a organizar o seu comercial por conta própria, esse é um bom primeiro passo:',
    ],
  },
  faturamento: {
    titulo: 'Seu faturamento ainda não está no ponto em que a gente consegue ajudar.',
    paragrafos: [
      'O tamanho da sua ambição não entra nessa conta. O que entra é o que o nosso método precisa pra funcionar. A gente instala um time comercial com pré-vendas, closer, rotina e meta. Isso tem custo: tráfego, salário, ferramenta. Abaixo de R$ 40 mil por mês, esse custo come a margem antes do resultado aparecer, e o projeto vira um peso em vez de virar alavanca.',
      'Nessa fase, quem mais vende na empresa costuma ser o próprio dono. E está certo que seja. O trabalho agora é deixar a oferta redonda e o processo de venda claro na sua cabeça, pra depois passar pra um time.',
      'Quando a empresa passar dos R$ 40 mil por mês, volta aqui. Esse é o momento em que um comercial estruturado começa a se pagar.',
      'Até lá, isso aqui ajuda a chegar mais rápido:',
    ],
  },
  cargo: {
    titulo: 'Quem decide sobre o comercial da empresa precisa estar nessa conversa.',
    paragrafos: [
      'A gente entra na operação e muda processo, time, meta e até oferta. Isso só anda quando o sócio ou o dono está dentro, decidindo junto com a gente desde a primeira call.',
      'Por isso a gente só atende diretamente quem é sócio, CEO ou dono. Sem o decisor na mesa, o projeto trava na primeira mudança que mexe no caixa ou na estrutura.',
      'Se faz sentido pra sua empresa, mostra essa página pro sócio e pede pra ele aplicar. Você pode (e deve) estar junto na conversa.',
      'Enquanto isso, isso aqui vale pra você e pro time:',
    ],
  },
  'nicho-analise': {
    titulo: 'A gente geralmente não trabalha com indústria e varejo. Mas queremos entender o seu caso.',
    paragrafos: [
      'O nosso método foi feito pra empresas que vendem por conversa: lead, pré-vendas, call, fechamento. Indústria e varejo costumam vender por representante, distribuidor e ponto de venda, e aí a gente não é a melhor escolha.',
      'Mas tem empresa que vende dos dois jeitos, ou que tem uma parte do comercial que funciona como venda consultiva. Pela sua empresa e pelo seu cargo, vale a gente olhar com calma. Conta como o seu negócio funciona. Quem lê é a nossa gestão comercial, não um robô.',
      'Se fizer sentido, alguém do nosso time chama você no WhatsApp.',
    ],
  },
}

const RECEBIDO = 'Recebido. A nossa gestão comercial vai ler o que você escreveu. Se o seu caso encaixar, a gente te chama no WhatsApp.'

const PARA_QUEM = [['b2b', 'B2B'], ['b2c', 'B2C'], ['b2g', 'B2G'], ['b2b2c', 'B2B2C']]
const CANAIS = [['loja-fisica', 'Loja física'], ['ecommerce', 'E-commerce'], ['representantes', 'Representantes ou distribuidores'], ['vendedores-internos', 'Vendedores internos'], ['marketplace', 'Marketplace']]
const TIMES = [['0', '0'], ['1-3', '1 a 3'], ['4-10', '4 a 10'], ['10+', 'Mais de 10']]

export function lerMotivo(valor: string | null): Motivo | null {
  return valor === 'nicho' || valor === 'faturamento' || valor === 'cargo' || valor === 'nicho-analise' ? valor : null
}

/* "Preenchi algo errado?": volta pro formulário do fap01 com as respostas que esta página
   recebeu na URL (o fap01 abre o formulário preenchido com ?corrigir=1). Token, sid e motivo ficam de fora. */
const FORM_URL = 'https://fap01.fullsalessystem.com/'
const LEVA = ['nome', 'email', 'whatsapp', 'cargo', 'segmento', 'receita', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function CorrigirLink({ escuro }: { escuro?: boolean }) {
  const params = useSearchParams()
  const q = new URLSearchParams({ corrigir: '1' })
  for (const k of LEVA) { const v = params.get(k); if (v) q.set(k, v) }
  return (
    <p style={{ fontSize: 14, marginTop: 4, marginBottom: 16 }}>
      <a href={`${FORM_URL}?${q.toString()}`} style={{ color: escuro ? 'rgba(255,255,255,0.55)' : '#6B7280', textDecoration: 'underline' }}>
        Preenchi algo errado? Corrigir minhas respostas
      </a>
    </p>
  )
}

function Texto({ motivo, escuro }: { motivo: Motivo; escuro?: boolean }) {
  const t = TEXTOS[motivo]
  return (
    <>
      <h1 style={{ fontSize: 'clamp(24px, 3.6vw, 36px)', fontWeight: 900, lineHeight: 1.18, letterSpacing: '-0.02em', color: escuro ? '#fff' : '#0A0A0A', marginBottom: 24 }}>
        {t.titulo}
      </h1>
      {t.paragrafos.map((p, i) => (
        <p key={i} style={{ fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.7, color: escuro ? 'rgba(255,255,255,0.75)' : '#374151', marginBottom: 16 }}>{p}</p>
      ))}
      <CorrigirLink escuro={escuro} />
    </>
  )
}

/* nicho, faturamento, cargo: entra antes da oferta atual da página */
export function MotivoSection({ motivo }: { motivo: Exclude<Motivo, 'nicho-analise'> }) {
  return (
    <section style={{ background: '#FFFFFF', padding: '48px 0 32px' }}>
      <div className="section-container" style={{ maxWidth: 760 }}>
        <Texto motivo={motivo} />
      </div>
    </section>
  )
}

const caixa: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 10, color: '#fff', fontSize: 15, cursor: 'pointer' }
const legenda: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }

/* nicho-analise: texto 4 + formulário extra, sem oferta */
export function AnalisePage({ token }: { token: string }) {
  const [estado, setEstado] = useState<'form' | 'enviando' | 'ok' | 'erro'>('form')

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setEstado('enviando')
    try {
      /* text/plain: requisição simples, sem preflight de CORS */
      const r = await fetch(ANALISE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          t: token,
          modelo_negocio: String(f.get('modelo_negocio') || ''),
          para_quem: f.getAll('para_quem'),
          canais: f.getAll('canais'),
          time_comercial: String(f.get('time_comercial') || ''),
          visitor_id: (window as unknown as { __fssVid?: string }).__fssVid || '',
        }),
      })
      setEstado(r.ok ? 'ok' : 'erro')
    } catch {
      setEstado('erro')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff' }}>
      <div className="section-container" style={{ height: 64, display: 'flex', alignItems: 'center' }}>
        <img src="/logo-fss-branco.png" alt="Full Sales System" style={{ height: 36, width: 'auto', display: 'block' }} />
      </div>
      <div className="section-container" style={{ maxWidth: 720, padding: '48px 24px 96px' }}>
        <Texto motivo="nicho-analise" escuro />
        {estado === 'ok' ? (
          <p role="status" style={{ marginTop: 24, padding: '20px 22px', borderRadius: 12, background: 'rgba(22,163,74,0.14)', border: '1px solid rgba(22,163,74,0.5)', fontSize: 17, lineHeight: 1.6, fontWeight: 600 }}>
            {RECEBIDO}
          </p>
        ) : (
          <form onSubmit={enviar} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={legenda}>Como funciona o seu negócio?</span>
              <textarea name="modelo_negocio" required minLength={2} maxLength={2000} rows={6}
                style={{ width: '100%', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16, fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical' }} />
            </label>
            <fieldset style={{ border: 0 }}>
              <legend style={legenda}>Para quem você vende?</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                {PARA_QUEM.map(([v, l]) => <label key={v} style={caixa}><input type="checkbox" name="para_quem" value={v} /> {l}</label>)}
              </div>
            </fieldset>
            <fieldset style={{ border: 0 }}>
              <legend style={legenda}>Por onde você vende?</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                {CANAIS.map(([v, l]) => <label key={v} style={caixa}><input type="checkbox" name="canais" value={v} /> {l}</label>)}
              </div>
            </fieldset>
            <fieldset style={{ border: 0 }}>
              <legend style={legenda}>Quantas pessoas tem no time comercial?</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                {TIMES.map(([v, l]) => <label key={v} style={caixa}><input type="radio" name="time_comercial" value={v} /> {l}</label>)}
              </div>
            </fieldset>
            {estado === 'erro' && (
              <p role="alert" style={{ color: '#FCA5A5', fontSize: 15 }}>Não conseguimos enviar agora. Tente de novo em instantes.</p>
            )}
            <button type="submit" className="btn-primary" disabled={estado === 'enviando'} style={{ fontSize: 16, padding: '16px 20px', border: 0, cursor: 'pointer' }}>
              {estado === 'enviando' ? 'Enviando...' : 'Enviar para análise'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
