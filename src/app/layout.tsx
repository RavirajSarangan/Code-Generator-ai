import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed as it causes module not found error
// import { GeistMono } from 'geist/font/mono'; // Removed as it causes module not found error
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

export const metadata: Metadata = {
  title: 'Python Tutor',
  description: 'AI-Powered Python Code Generator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed GeistMono.variable and GeistSans.variable */}
      <body className={`antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster */}
      </body>
    </html>
  );
}
