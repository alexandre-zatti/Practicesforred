'use client'

import './globals.css'
import { Playfair_Display, Poppins } from 'next/font/google'
import ThemeProvider from "@/components/ThemeProvider";
import { store } from "@/store/store";
import { Provider } from 'react-redux'
import Loading from "@/components/Loading";
import Toast from "@/components/Toast";
import { StyledEngineProvider } from "@mui/material";

const poppins = Poppins({subsets: ['latin'], weight: ['400', '600']})
const playfairDisplay = Playfair_Display({subsets: ['latin']})

export default function RootLayout({children}: {
  children: React.ReactNode
}) {

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <html lang="en" className={`${playfairDisplay.className} ${poppins.className}`}>
        <ThemeProvider>
          <body>
          <Loading/>
          <Toast/>
          {children}
          </body>
        </ThemeProvider>
        </html>
      </StyledEngineProvider>
    </Provider>
  )
}
