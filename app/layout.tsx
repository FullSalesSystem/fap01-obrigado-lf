import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Obrigado | Full Sales System',
  description:
    'Você deu o primeiro passo. Conheça a Full Sales System — a consultoria que já estruturou mais de 550 operações comerciais no Brasil, Portugal e EUA.',
  keywords: [
    'estrutura comercial',
    'sistema de vendas',
    'escalar negócio',
    'full sales system',
    'vinícius de sá',
  ],
  openGraph: {
    title: 'Obrigado | Full Sales System',
    description:
      'Você deu o primeiro passo. Conheça a Full Sales System — a consultoria que já estruturou mais de 550 operações comerciais.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
