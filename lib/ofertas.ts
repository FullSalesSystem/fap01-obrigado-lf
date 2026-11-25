// Conteúdo das versões do teste A/B do desqualificado (A saiu em 24/11; no ar: B e C). Arquivo IGUAL nos dois
// repositórios. O desenho da página (components/PaginaOferta.tsx) é um só: A e B
// mudam APENAS o que está aqui, para o teste medir a oferta e não o layout.
//
// Fontes: A = texto da página da Academy no ar em 13/11/2026 (sem travessão e sem
// "sem custo"); B = mssquiz.fullsalessystem.com/fdr-01 (13/11/2026) + argumento do
// gestor ("aumentar de 30 a 40% a sua conversão"). Copy sem emoji, sem "gratuito" e
// sem supor cargo (o desqualificado pode ser dono, gerente ou vendedor).

import type { Variante } from './abOferta'

export type IconeNome = 'biblioteca' | 'call' | 'diagnostico' | 'workshop' | 'calculadora' | 'aula' | 'prompt' | 'ligacao' | 'email' | 'preencher' | 'reuniao'

// Capa: imagem do produto, ou capa desenhada na página para um bônus que não tem imagem.
export type Capa = string | { tag: string; nome: string; curto: string; icone: IconeNome }

export interface Oferta {
  produto: string
  // headline: [antes, PRODUTO, meio, ARGUMENTO, depois]: produto e argumento em destaque
  titulo: [string, string, string, string, string]
  apoio: string
  visual: { capas: Capa[]; selo: string }
  precoCartao: { rotulo: string; de: string; por: string; nota: string; sufixo?: string } // sufixo: '/mês' ao lado do número
  cta: string
  ctaCurto: string
  selos: [string, string, string]
  recebe: {
    titulo: string
    sub: string
    destaque: { tag: string; nome: string; desc: string }
    itens: { icone: IconeNome; tag: string; nome: string; desc: string }[]
  }
  dentro:
    | { tipo: 'capas'; olho: string; titulo: string; sub: string; capas: { src: string; nome: string }[] }
    | { tipo: 'passos'; olho: string; titulo: string; sub: string; passos: { icone: IconeNome; nome: string }[] }
  oferta: { titulo: string; sub: string; pilha: { item: string; valor?: string }[]; de: string; por: string; nota: string; sufixo?: string; cta: string; garantia: string }
  sobre: string
  fixo: string
  faixa: { titulo: string; texto: string }
}

const A: Oferta = {
  produto: 'Full Sales Academy',
  titulo: ['O ', 'Full Sales Academy', ' reúne tudo que você precisa para ', 'dominar vendas e estruturar uma operação comercial', ''],
  apoio: 'Scripts, playbooks, ferramentas de gestão, cursos de liderança e muito mais: o mesmo conteúdo que já estruturou o comercial de mais de 700 empresas, para você aplicar hoje.',
  visual: { capas: ['/oferta/academy/vendedor-top-1.webp', '/oferta/academy/kit-gestao-comercial.webp', '/oferta/academy/persuasao-pro.webp'], selo: '+14 módulos' },
  precoCartao: { rotulo: 'Acesso anual', de: 'R$ 1.164', por: '597', nota: 'à vista, equivale a R$ 49,75 por mês' },
  cta: 'Garantir acesso anual',
  ctaCurto: 'Garantir acesso',
  selos: ['Acesso imediato', 'Cancele quando quiser', 'Pagamento seguro'],
  recebe: {
    titulo: 'Tudo o que vem no Full Sales Academy',
    sub: 'Cada conteúdo resolve um ponto da área comercial: prospecção, reunião, gestão e liderança.',
    destaque: { tag: 'O acesso', nome: 'Full Sales Academy', desc: 'Mais de 14 módulos e cursos completos de vendas, prospecção, gestão comercial e liderança, no mesmo lugar.' },
    itens: [
      { icone: 'biblioteca', tag: 'Incluso', nome: 'Full Sales Flix', desc: 'Biblioteca com playbooks, estudos de caso, guias práticos e workshops com especialistas.' },
      { icone: 'call', tag: 'Incluso', nome: 'Análises de call com Yuri Barbosa', desc: 'Ligações comerciais reais comentadas, com feedback ao vivo.' },
      { icone: 'diagnostico', tag: 'Incluso', nome: 'Análises de negócios com Vinícius de Sá', desc: 'Diagnósticos reais de operações comerciais comentados ao vivo.' },
      { icone: 'workshop', tag: 'Incluso', nome: 'Workshops com convidados', desc: 'Workshops exclusivos com especialistas, e conteúdo novo entrando no mesmo acesso.' },
    ],
  },
  dentro: {
    tipo: 'capas',
    olho: 'Por dentro',
    titulo: '14 módulos e a biblioteca do Full Sales Flix',
    sub: 'Arraste para o lado e veja o que você acessa hoje.',
    capas: [
      { src: '/oferta/academy/vendedor-top-1.webp', nome: 'Vendedor Top 1' },
      { src: '/oferta/academy/master-sales-script.webp', nome: 'Master Sales Script' },
      { src: '/oferta/academy/persuasao-pro.webp', nome: 'Persuasão Pro' },
      { src: '/oferta/academy/workshop-prospeccao-7d.webp', nome: 'Workshop Prospecção 7D' },
      { src: '/oferta/academy/intensivo-fechamento.webp', nome: 'Intensivo Fechamento em Reunião' },
      { src: '/oferta/academy/kit-gestao-comercial.webp', nome: 'Kit de Gestão Comercial' },
      { src: '/oferta/academy/analises-de-call.webp', nome: 'Análises de Call com Yuri Barbosa' },
      { src: '/oferta/academy/raio-x-da-personalidade.webp', nome: 'Raio X da Personalidade' },
      { src: '/oferta/academy/lideranca-financeira.webp', nome: 'Liderança Financeira' },
      { src: '/oferta/academy/mapa-da-otimizacao.webp', nome: 'Mapa da Otimização' },
      { src: '/oferta/academy/desafio-plano-sem-risco.webp', nome: 'Desafio Plano Sem Risco 2026' },
      { src: '/oferta/academy/a-riqueza-da-necessidade.webp', nome: 'A Riqueza da Necessidade' },
      { src: '/oferta/academy/eleve-se.webp', nome: 'Eleve-se' },
      { src: '/oferta/academy/analise-de-negocios.webp', nome: 'Análises de Negócios com Vinícius de Sá' },
      { src: '/oferta/flix/playbook-estruturacao-3.webp', nome: 'Playbook de Estruturação Comercial 3.0' },
      { src: '/oferta/flix/script-quebra-objecoes.webp', nome: 'Script para Quebra de Objeções' },
      { src: '/oferta/flix/guia-social-selling.webp', nome: 'Guia Prático de Social Selling' },
      { src: '/oferta/flix/estudo-de-caso.webp', nome: 'Estudo de Caso: Gabriel Bueno' },
      { src: '/oferta/flix/bonus-3-alfredo-soares.webp', nome: 'Talk com Alfredo Soares' },
      { src: '/oferta/flix/bonus-2-social-selling.webp', nome: 'Workshop de Social Selling' },
    ],
  },
  oferta: {
    titulo: 'Full Sales Academy',
    sub: 'Tudo para estruturar, evoluir e dominar o processo comercial, em um único lugar, por um único preço.',
    pilha: [
      { item: 'Mais de 14 módulos e cursos completos do Full Sales Academy' },
      { item: 'Acesso completo ao Full Sales Flix e à biblioteca de playbooks e guias' },
      { item: 'Workshops exclusivos com especialistas convidados' },
      { item: 'Análises de call reais comentadas por Yuri Barbosa' },
      { item: 'Diagnósticos de negócios ao vivo com Vinícius de Sá' },
      { item: 'Atualizações e conteúdos novos no mesmo acesso' },
    ],
    de: 'R$ 1.164',
    por: '597',
    nota: 'à vista, equivale a R$ 49,75 por mês',
    cta: 'Garantir acesso por R$ 597',
    garantia: 'Pagamento seguro. Acesso imediato. Cancele quando quiser.',
  },
  sobre: 'O Full Sales Academy reúne esse mesmo conhecimento em conteúdos práticos que você aplica a partir de hoje.',
  fixo: 'R$ 597 à vista',
  faixa: { titulo: 'Tudo isso por menos de R$ 50 por mês', texto: 'Mais de 14 módulos, a biblioteca do Full Sales Flix, análises de call reais e workshops. Acesso imediato.' },
}

const B: Oferta = {
  produto: 'Master Sales Script',
  titulo: ['O ', 'Master Sales Script', ' é o script da Full Sales para ', 'aumentar de 30 a 40% a sua conversão', ' nas calls de venda'],
  apoio: 'Feito para levar o cliente a decidir já na primeira reunião. Você recebe o script completo, a aula que mostra como preencher com o seu produto e 4 bônus.',
  visual: {
    capas: [
      '/oferta/academy/master-sales-script.webp',
      { tag: 'Bônus 1', nome: 'Calculadora de dimensionamento comercial', curto: 'Calculadora', icone: 'calculadora' },
      { tag: 'Bônus 2', nome: 'Masterclass de dimensionamento comercial', curto: 'Masterclass', icone: 'aula' },
    ],
    selo: '+4 bônus',
  },
  precoCartao: { rotulo: 'Script + 4 bônus', de: 'R$ 710', por: '97', nota: 'à vista ou 12x de R$ 10,03' },
  cta: 'Quero o Master Sales Script',
  ctaCurto: 'Quero o script',
  selos: ['Acesso imediato', 'Garantia de 60 dias', 'Pagamento seguro'],
  recebe: {
    titulo: 'Tudo o que vem no Master Sales Script',
    sub: 'O que falar na call para converter mais, quantas pessoas a meta pede e como marcar mais reuniões.',
    destaque: { tag: 'O produto', nome: 'Master Sales Script', desc: 'O script completo que a Full Sales usa nas calls de venda, com a aula que mostra como preencher com o seu produto e aplicar na reunião.' },
    itens: [
      { icone: 'calculadora', tag: 'Bônus 1', nome: 'Calculadora de dimensionamento comercial', desc: 'Descubra em 5 minutos quantos vendedores a meta exige.' },
      { icone: 'aula', tag: 'Bônus 2', nome: 'Masterclass de dimensionamento comercial', desc: 'Quantas pessoas contratar para vender e como contratar rápido.' },
      { icone: 'prompt', tag: 'Bônus 3', nome: 'Prompts de IA para o script de agendamento', desc: 'Prompts prontos para montar no ChatGPT o roteiro que marca as reuniões.' },
      { icone: 'ligacao', tag: 'Bônus 4', nome: 'Ligação de Diagnóstico', desc: 'Um gestor comercial da Full Sales analisa com você como a venda acontece hoje.' },
    ],
  },
  dentro: {
    tipo: 'passos',
    olho: 'Como usar',
    titulo: 'Pronto antes da sua próxima reunião',
    sub: 'Quatro passos entre a compra e a próxima call.',
    passos: [
      { icone: 'email', nome: 'Receba o acesso no seu e-mail' },
      { icone: 'aula', nome: 'Assista à aula' },
      { icone: 'preencher', nome: 'Preencha o script com o seu produto' },
      { icone: 'reuniao', nome: 'Aplique na próxima reunião' },
    ],
  },
  oferta: {
    titulo: 'Master Sales Script',
    sub: 'O script para aumentar de 30 a 40% a sua conversão, com a aula e os 4 bônus, num pagamento único.',
    pilha: [
      { item: 'Master Sales Script', valor: 'R$ 267' },
      { item: 'Calculadora de dimensionamento comercial', valor: 'R$ 97' },
      { item: 'Masterclass de dimensionamento comercial', valor: 'R$ 249' },
      { item: 'Prompts de IA para o script de agendamento', valor: 'R$ 97' },
      { item: 'Ligação de Diagnóstico', valor: 'incluso' },
    ],
    de: 'R$ 710',
    por: '97',
    nota: 'à vista ou 12x de R$ 10,03',
    cta: 'Quero o script por R$ 97',
    garantia: 'Compra segura. Acesso imediato. Garantia de 60 dias.',
  },
  sobre: 'O Master Sales Script é o mesmo script que a Full Sales usa nas calls de venda, pronto para você preencher com o seu produto.',
  fixo: 'R$ 97 à vista',
  faixa: { titulo: 'Tudo isso por R$ 97 à vista', texto: 'O script, a aula e 4 bônus. Acesso imediato no e-mail, com garantia de 60 dias.' },
}

// C ("C de coração", 24/11/2026): Full Sales Academy por assinatura, R$ 59/mês sempre
// (checkout Ticto O6F487EB3, o mesmo da /academy-black-friday/), cancela quando quiser.
// Produto e entregas da página da Black, SEM nenhum argumento de Black Friday nem o presente.
const C: Oferta = {
  produto: 'Full Sales Academy',
  titulo: ['O ', 'Full Sales Academy', ' reúne em uma assinatura ', 'tudo para vender com processo, não no improviso', ''],
  apoio: 'Cursos, scripts e playbooks com o mesmo método que já estruturou o comercial de mais de 700 empresas. Conteúdo novo toda semana, por menos de R$ 2 por dia.',
  visual: { capas: ['/oferta/academy/vendedor-top-1.webp', '/oferta/academy/kit-gestao-comercial.webp', '/oferta/academy/persuasao-pro.webp'], selo: '+14 módulos' },
  precoCartao: { rotulo: 'Assinatura mensal', de: '', por: '59', sufixo: '/mês', nota: 'menos de R$ 2 por dia' },
  cta: 'Quero assinar a Academy',
  ctaCurto: 'Assinar',
  selos: ['Acesso imediato', 'Cancele quando quiser', 'Pagamento seguro'],
  recebe: {
    titulo: 'Tudo o que vem na assinatura',
    sub: 'Cada conteúdo resolve um ponto da área comercial: prospecção, reunião, gestão e liderança.',
    destaque: { tag: 'A assinatura', nome: 'Full Sales Academy', desc: 'Mais de 14 módulos, cursos e ferramentas de vendas, prospecção, gestão comercial e liderança, no mesmo lugar.' },
    itens: [
      { icone: 'biblioteca', tag: 'Incluso', nome: 'Full Sales Flix', desc: 'Biblioteca com playbooks, estudos de caso, guias práticos e workshops com especialistas.' },
      { icone: 'call', tag: 'Incluso', nome: 'Análises de call com Yuri Barbosa', desc: 'Ligações comerciais reais analisadas, com feedback ao vivo.' },
      { icone: 'diagnostico', tag: 'Incluso', nome: 'Análises de negócios com Vinícius de Sá', desc: 'Diagnósticos reais de operações comerciais comentados ao vivo.' },
      { icone: 'workshop', tag: 'Toda semana', nome: 'Aulas e webinários novos', desc: 'Todas as atualizações já fazem parte da assinatura, sem pagar nada a mais.' },
    ],
  },
  dentro: A.dentro,
  oferta: {
    titulo: 'Full Sales Academy',
    sub: 'Tudo para estruturar e evoluir o processo comercial, em um único lugar, numa assinatura mensal.',
    pilha: [
      { item: 'Mais de 14 módulos e cursos completos do Full Sales Academy' },
      { item: 'Full Sales Flix, com playbooks, estudos de caso e guias' },
      { item: 'Workshops exclusivos com especialistas convidados' },
      { item: 'Análises de call reais comentadas por Yuri Barbosa' },
      { item: 'Diagnósticos de negócios ao vivo com Vinícius de Sá' },
      { item: 'Aulas e webinários novos toda semana, já incluídos' },
    ],
    de: '',
    por: '59',
    sufixo: '/mês',
    nota: 'menos de R$ 2 por dia',
    cta: 'Assinar por R$ 59 por mês',
    garantia: 'Pagamento seguro. Acesso imediato. Cancele quando quiser.',
  },
  sobre: 'O Full Sales Academy reúne esse mesmo conhecimento em conteúdos práticos, numa assinatura mensal.',
  fixo: 'R$ 59 por mês',
  faixa: { titulo: 'Tudo isso por R$ 59 por mês', texto: 'Mais de 14 módulos, o Full Sales Flix, análises de call reais e conteúdo novo toda semana. Cancele quando quiser.' },
}

export const OFERTAS: Record<Variante, Oferta> = { A, B, C }
