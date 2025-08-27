import React, {Component} from 'react'
import {Box} from '@mui/material'
import {Btn, Txt} from '@infoportal/client-core'
import {useConfig} from '@/DatatableConfig.js'

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

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      return (
        <Box sx={{p: 2}}>
          <Body />
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

function Body() {
  const {globalErrorMessage, m} = useConfig()

  const refreshPage = (hard?: boolean) => {
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

  return (
    <>
      <Box sx={{mb: 1}}>{globalErrorMessage}</Box>
      <Btn icon="refresh" onClick={() => refreshPage()} color="primary" variant="contained" sx={{mr: 1}}>
        {m.refresh}
      </Btn>
      <Btn icon="settings_backup_restore" onClick={() => refreshPage(true)} color="primary" variant="text">
        {m.hardRefresh}
      </Btn>
    </>
  )
}
