import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InstaPulse AI — Creator Intelligence & Content Strategy',
  description:
    'Turn your Instagram analytics into distribution leverage. Connect via Meta Graph API for automated niche categorization, algorithmic gap audits, trending formats, scripts, and high-ranking hashtag clusters.',
  keywords: [
    'Instagram analytics',
    'Meta Graph API',
    'Instagram AI content strategy',
    'viral hooks generator',
    'creator economy SaaS',
  ],
  authors: [{ name: 'InstaPulse Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100">
        <div className="relative min-h-screen flex flex-col bg-grid-pattern">
          {children}
        </div>
      </body>
    </html>
  );
}
