'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import ThemeProvider from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { Provider } from 'react-redux'

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children}: {
  children: React.ReactNode
}) {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
      </ThemeProvider>
    </Provider>
  )
}
