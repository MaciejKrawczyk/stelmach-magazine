import './globals.css'
import type { Metadata } from 'next'
import { Merriweather_Sans } from 'next/font/google'
import React from "react";
import Navbar from "@/src/components/Navbar";



const font = Merriweather_Sans({subsets: ["latin"]})

export const metadata: Metadata = {
  title: 'Magazyn narzędzi Stelmach',
  description: 'Magazyn narzędzi dla firmy PZ Stelmach, projekt i implementacja: Maciej Krawczyk',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pl">

      <body className={font.className}>

      <header>
        <Navbar />
      </header>

      <div>
          {children}
      </div>

      </body>

      </html>
  )
}
