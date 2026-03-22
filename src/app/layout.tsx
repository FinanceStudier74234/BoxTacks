import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boxtacks — Product Building Platform',
  description:
    'Boxtacks is a professional-grade visual product-building, manufacturing organization, and business workflow platform for entrepreneurs, brands, and builders.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
