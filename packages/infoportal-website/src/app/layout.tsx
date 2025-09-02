import type {Metadata} from 'next'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {openSansFont, theme} from '@/app/theme'
import {m} from '@/i18n'
import './layout.css'

export const metadata: Metadata = {
  title: m.title,
  description: m.desc,
  icons: {
    icon: '/favicon.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={openSansFont.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
