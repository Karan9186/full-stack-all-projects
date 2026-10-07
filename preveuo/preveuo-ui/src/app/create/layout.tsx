import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preveuo Studio | Demo Builder',
  description: 'Create and edit your interactive product walkthrough in the Preveuo Studio editor.',
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
