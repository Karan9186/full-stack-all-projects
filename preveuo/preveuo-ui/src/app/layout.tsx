import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Preveuo | Turn Your Product into an Interactive Experience',
  description: 'Create beautiful product demos, personalized tours, and sales stories that help every buyer understand your value—without waiting for a call.',
  keywords: ['interactive demo', 'product walkthrough', 'guided tour', 'product demo software', 'interactive showcase', 'SaaS demos'],
  openGraph: {
    title: 'Preveuo — Turn Your Product into an Interactive Experience',
    description: 'Create beautiful product demos that help every buyer understand your value.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className} h-full antialiased`} suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-white text-[#0f0f1a] font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
