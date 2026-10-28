import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TERRA & FORM | Modern Curated Home & Office Decor',
    template: '%s | TERRA & FORM',
  },
  description:
    'Thoughtfully selected ceramic vases, indoor planters, sculptural decor, and tabletop accessories that bring quiet warmth and character to every corner.',
  keywords: [
    'home decor',
    'flower vases',
    'indoor planters',
    'flower pots',
    'tabletop decor',
    'office decor',
    'ceramic vase',
    'minimalist decor',
  ],
  authors: [{ name: 'TERRA & FORM Atelier' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'TERRA & FORM | Modern Curated Home Decor',
    description: 'Thoughtfully selected pieces for beautiful spaces.',
    siteName: 'TERRA & FORM',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
