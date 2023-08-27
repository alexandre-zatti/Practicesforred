import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'TCC',
  description: 'Projeto TCC by Alexandre Zatti',
}

export default function RootLayout({children}: {
  children: React.ReactNode
}) {

  return (
    <ThemeProvider>
      <html lang="en">
      <body className={inter.className}>{children}</body>
      </html>
    </ThemeProvider>

  )
}
