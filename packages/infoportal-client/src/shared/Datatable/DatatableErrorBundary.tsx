import React, {Component} from 'react'
import {Box} from '@mui/material'
import {appConfig} from '@/conf/AppConfig'
import {en} from '@/core/i18n/localization/en'
import {Core} from '@/shared'

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
          <Core.Txt bold size="title" block sx={{mb: 1}}>
            {en.messages.somethingWentWrong}
          </Core.Txt>
          <Box sx={{mb: 1}}>
            If the problem persist, please contact <b>{appConfig.contact}</b> and include the snippet below.
          </Box>

          <Core.Btn icon="refresh" onClick={() => this.refreshPage()} color="primary" variant="contained" sx={{mr: 1}}>
            {en.messages.refresh}
          </Core.Btn>
          <Core.Btn icon="settings_backup_restore" onClick={() => this.refreshPage(true)} color="primary" variant="text">
            {en.messages.hardRefresh}
          </Core.Btn>

          <Box
            sx={t => ({
              fontFamily: 'monospace',
              py: 1,
              mt: 2,
              px: 2,
              borderRadius: `calc(${t.vars.shape.borderRadius} - 1px)`,
              background: t.vars.palette.grey[100],
            })}
          >
            {error && (
              <Core.Txt bold size="big">
                {error.toString()}
              </Core.Txt>
            )}
            <pre>{error && <Core.Txt>{error.stack}</Core.Txt>}</pre>
          </Box>
        </Box>
      )
    }
    return this.props.children
  }
}
