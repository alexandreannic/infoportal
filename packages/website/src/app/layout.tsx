import type {Metadata} from 'next'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter'
import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {openSansFont, theme} from '@/app/theme'
import {m} from '@/i18n'
import './layout.css'
import {Header} from '@/shared/Header/Header'

export const metadata: Metadata = {
  title: m.title,
  description: m.desc,
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={openSansFont.variable}>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header/>
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
