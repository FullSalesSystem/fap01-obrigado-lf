import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Obrigado | Full Sales System',
  description:
    'Você deu o primeiro passo. Conheça a Full Sales System, a consultoria que já estruturou mais de 550 operações comerciais no Brasil, Portugal e EUA.',
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
      'Você deu o primeiro passo. Conheça a Full Sales System, a consultoria que já estruturou mais de 550 operações comerciais.',
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
      <head>
        {/* ── Meta Pixel PRIMEIRO (24/11/2026): no <head>, sem esperar a hidratação do Next.
             Antes era next/script afterInteractive. O stub deixa passar só o 1º PageView.
             Os eventos personalizados (eventID = ?sid=) seguem no meta-pixel-events abaixo.
             24/11 (spec 07): init com external_id (cookie fss_vid) + em/ph/fn/ln/country da URL. ── */}
        <script dangerouslySetInnerHTML={{ __html: "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){var a=Array.prototype.slice.call(arguments),m=a[0],k=(m==='track'||m==='trackCustom')?1:((m==='trackSingle'||m==='trackSingleCustom')?2:-1);if(k>0&&a[k]==='PageView'){if(n._pv)return;n._pv=1}if(k>0&&f.__fssEid&&f.__fssEid[a[k]]&&!a[k+2]){a[k+1]=a[k+1]||{};a[k+2]={eventID:f.__fssEid[a[k]]}}n.callMethod?n.callMethod.apply(n,a):n.queue.push(a)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');(function(w,d){var vid='';try{var c=d.cookie.match(/(?:^|;\\s*)fss_vid=([^;]+)/);vid=c?decodeURIComponent(c[1]):'';if(!/^[0-9a-f-]{36}$/i.test(vid)){vid=w.crypto&&crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(x){var r=Math.random()*16|0;return(x==='x'?r:(r&3|8)).toString(16)})}vid=vid.toLowerCase();d.cookie='fss_vid='+vid+';path=/;max-age=63072000;SameSite=Lax'+(/(^|\\.)fullsalessystem\\.com$/.test(location.hostname)?';domain=.fullsalessystem.com':'')+(location.protocol==='https:'?';Secure':'')}catch(x){}w.__fssVid=vid;var ud={};if(vid)ud.external_id=vid;try{var q=new URLSearchParams(location.search),em=(q.get('email')||'').trim().toLowerCase(),ph=(q.get('phone')||q.get('whatsapp')||q.get('telefone')||'').replace(/\\D/g,''),nm=(q.get('nome')||q.get('name')||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z\\s]/g,' ').trim().split(/\\s+/).filter(Boolean);if(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em))ud.em=em;if(ph.length===10||ph.length===11)ph='55'+ph;if(ph.length>=12)ud.ph=ph;if(nm[0])ud.fn=nm[0];if(nm.length>1)ud.ln=nm[nm.length-1];if(ud.em||ud.ph)ud.country='br'}catch(x){}fbq('init','288404690470754',ud);fbq('track','PageView')})(window,document);" }} />
      </head>
      <body>
        {/* noscript como HTML cru: com <img> em JSX o React gerava um <link rel="preload"> no
            <head> e o navegador COM JS também batia no ev=PageView (2 PageViews por visita). */}
        <noscript dangerouslySetInnerHTML={{ __html: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=288404690470754&ev=PageView&noscript=1" alt="" />' }} />

        {/* ── Eventos personalizados — FAP01-LF ── */}
        <Script id="meta-pixel-events" strategy="afterInteractive">{`
          /* eventID = ?sid= (submission_id do form do fap01): o /api/lead manda
             os mesmos eventos pela Conversions API e a Meta deduplica. */
          var sid = '';
          try { sid = new URLSearchParams(location.search).get('sid') || ''; } catch (e) {}
          function px(nome) { sid ? fbq('trackCustom', nome, {}, { eventID: sid }) : fbq('trackCustom', nome); }
          px('Pageview-lead-desqualificado-geral');
          px('Lead_desqualificado_FAP01');
          console.log('✅ Eventos Meta enviados: Pageview-lead-desqualificado-geral e Lead_desqualificado_FAP01');
        `}</Script>

        {children}
      </body>
    </html>
  )
}
