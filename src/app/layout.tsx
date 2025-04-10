import './globals.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import { siteMetadata } from './constants';
import { BookingClosureProvider } from './contexts/BookingClosureContext';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';

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
  // Check for Supabase environment variables
  const hasSupabaseCredentials = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <BookingClosureProvider>
              {children}
            </BookingClosureProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
