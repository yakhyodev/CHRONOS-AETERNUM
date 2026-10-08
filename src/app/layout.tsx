import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHRONOS — AETERNUM | A Cinematic Journey Through Time',
  description:
    'A cinematic, scroll-driven interactive exploration of the lost city of Aeternum across five historical eras, powered by WebGL and Three.js.',
  metadataBase: new URL('https://chronos-aeternum.vercel.app'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/chronos/chronos-core-emblem.svg',
  },
  openGraph: {
    title: 'CHRONOS — AETERNUM',
    description: 'A Cinematic Journey Through Time across five historical eras.',
    url: 'https://chronos-aeternum.vercel.app',
    siteName: 'CHRONOS — Aeternum',
    images: [
      {
        url: '/chronos/phase11/images/00-phase11-master-art-direction.jpg',
        width: 1920,
        height: 1080,
        alt: 'CHRONOS — Aeternum Cinematic Visual Experience',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHRONOS — AETERNUM',
    description: 'A Cinematic Journey Through Time across five historical eras.',
    images: ['/chronos/phase11/images/00-phase11-master-art-direction.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05050a] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
