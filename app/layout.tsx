import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
// eslint-disable-next-line no-restricted-imports
import './globals.css';
import { Header } from '@/app/header';
import { Footer } from '@/app/footer';
import { ThemeProvider } from 'next-themes';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nim-fawn.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Rootfn',
    template: '%s | Rootfn',
  },
  description: "Rootfn is Eric Hasegawa's personal website.",
};

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Root Fn RSS Feed"
          href="api/rss.xml"
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} bg-white font-[family-name:var(--font-jetbrains-mono)] tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col">
            <div className="relative mx-auto flex w-full max-w-screen-md flex-1 flex-col px-4 pt-6">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
