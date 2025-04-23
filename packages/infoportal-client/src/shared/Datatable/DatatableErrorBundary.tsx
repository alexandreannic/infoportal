import React, {Component} from 'react'
import {Box} from '@mui/material'
import {Txt} from '@/shared/Txt'
import {IpBtn} from '@/shared/Btn'
import {appConfig} from '@/conf/AppConfig'
import {en} from '@/core/i18n/localization/en'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class DatatableErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error)
  }

  readonly refreshPage = (hard?: boolean) => {
    if (hard) {
      // const cleanLs = (prefix: string) => {
      //   for (let i = 0; i < localStorage.length; i++) {
      //     const key = localStorage.key(i)
      //     if (key && key.includes(prefix)) {
      //       console.log(key)
      //       localStorage.removeItem(key)
      //     }
      //   }
      // }
      // Obj.values(DatatableUtils.localStorageKey).map(cleanLs)
      localStorage.clear()
    }
    location.reload()
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      return (
        <Box sx={{p: 2}}>
          <Txt bold size="title" block sx={{mb: 1}}>
            {en.messages.somethingWentWrong}
          </Txt>
          <Box sx={{mb: 1}}>
            If the problem persist, please contact <b>{appConfig.contact}</b> and include the snippet below.
          </Box>

          <IpBtn icon="refresh" onClick={() => this.refreshPage()} color="primary" variant="contained" sx={{mr: 1}}>
            {en.messages.refresh}
          </IpBtn>
          <IpBtn icon="settings_backup_restore" onClick={() => this.refreshPage(true)} color="primary" variant="text">
            {en.messages.hardRefresh}
          </IpBtn>

          <Box
            sx={(t) => ({
              fontFamily: 'monospace',
              py: 1,
              mt: 2,
              px: 2,
              borderRadius: t.shape.borderRadius - 1 + 'px',
              background: t.palette.grey[100],
            })}
          >
            {error && (
              <Txt bold size="big">
                {error.toString()}
              </Txt>
            )}
            <pre>{error && <Txt>{error.stack}</Txt>}</pre>
          </Box>
        </Box>
      )
    }
    return this.props.children
  }
}
