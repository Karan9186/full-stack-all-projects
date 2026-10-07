import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Preveuo 2.0 | Interactive Demo Player',
  description: 'Experience a live interactive walkthrough powered by Preveuo smart beacons and virtual camera focus zoom.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
