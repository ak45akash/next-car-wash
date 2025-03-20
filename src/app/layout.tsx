import './globals.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import { siteMetadata } from './constants';
import { BookingClosureProvider } from './contexts/BookingClosureContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  metadataBase: new URL(siteMetadata.siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookingClosureProvider>
          {children}
        </BookingClosureProvider>
      </body>
    </html>
  );
}
