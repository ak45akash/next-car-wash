import './globals.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Diamond Steam Car Wash | Mohali',
  description: 'Premium car washing and detailing services in Mohali. Experience professional steam washing, interior detailing, ceramic coating and PPF installation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
