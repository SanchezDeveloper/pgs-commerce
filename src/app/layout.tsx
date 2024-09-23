import clsx from "clsx";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from '@clerk/localizations'


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PGS EPI's E-Commerce",
  description: "Seu EPI com quem entende de segurança",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br">
        <body
          className={clsx(`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-700 `)}
        >
          <NavBar />
          <main className=" p-16">
            {children}
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
