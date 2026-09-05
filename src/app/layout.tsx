import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IS-SMART — AI Indian Standards Intelligence',
  description:
    'AI-powered assistance for identifying applicable Indian Standards, related requirements, certifications, amendments, and tender specification gaps.',
  keywords: ['Indian Standards', 'BIS', 'procurement', 'IS standards', 'tender', 'AI'],
  authors: [{ name: 'IS-SMART' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <meta name="theme-color" content="#040d1a" />
      </head>
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
