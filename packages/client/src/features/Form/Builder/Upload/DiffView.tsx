import React, {RefObject, useEffect, useState} from 'react'
import 'react-diff-view/style/index.css'
import 'diff2html/bundles/css/diff2html.min.css'
import {Alert, Box, BoxProps, CircularProgress, useColorScheme, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import DiffWorker from './diff.worker?worker'

type Props = BoxProps & {
  oldStr: string
  newStr: string
  hasChanges?: (_: boolean) => void
  timeout?: number
  stepperRef: RefObject<Core.StepperHandle | null>
}

const TimeoutError = 'TimeoutError'

export const DiffView = ({timeout = 4_000, stepperRef, oldStr = '', newStr, sx, hasChanges, ...props}: Props) => {
  const {mode} = useColorScheme()
  const {m} = useI18n()
  const t = useTheme()
  const [html, setHtml] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const htmlRef = React.useRef(html)

  useEffect(() => {
    htmlRef.current = html
  }, [html])

  useEffect(() => {
    setLoading(true)
    const worker = new DiffWorker()
    const timeoutRef = setTimeout(() => {
      if (!htmlRef.current) {
        setError(TimeoutError)
        setLoading(false)
      }
    }, timeout)

    worker.postMessage({oldStr, newStr, mode})

    worker.onmessage = ({data}) => {
      clearTimeout(timeoutRef)
      if (data.success) {
        setHtml(data.html)
        hasChanges?.(data.hasChanges)
      } else {
        setError(data.error)
      }
      setLoading(false)
    }

    return () => {
      setLoading(false)
      setError(undefined)
      worker.terminate()
    }
  }, [oldStr, newStr])

  return (
    <Box
      sx={{
        borderRadius: t.vars.shape.borderRadius,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        '& .d2h-file-wrapper': {
          border: 'none',
          margin: 0,
        },
        '& .d2h-code-linenumber': {borderLeft: 'none'},
        '& .d2h-code-linenumber:first-of-type': {background: 'none'},
        '& .d2h-file-header': {
          display: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      <Core.Txt
        bold
        size="big"
        block
        sx={{
          pl: 2,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: t.vars.palette.divider,
        }}
      >
        {m.differences}
      </Core.Txt>
      {html ? (
        <div dangerouslySetInnerHTML={{__html: html}} />
      ) : loading ? (
        <Alert severity="info" sx={{borderRadius: 0}} icon={<CircularProgress size={20} color="inherit" />}>
          {m.loading}...
          {/*<Box sx={{p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>*/}
          {/*  <Core.Txt block sx={{mb: 2}}>*/}
          {/*    {m.loading}...*/}
          {/*  </Core.Txt>*/}
          {/*  <LinearProgress sx={{width: 200}} />*/}
          {/*</Box>*/}
        </Alert>
      ) : (
        error &&
        (error === TimeoutError ? (
          <Core.Alert icon={<CircularProgress size={20} color="inherit" />} sx={{borderRadius: 0}} severity="warning">
            {m._builder.diffTimeout}
            <Box display="flex" justifyContent="center">
              <Core.Btn
                sx={{mx: 0.5}}
                variant="outlined"
                color="inherit"
                icon="arrow_back"
                onClick={() => stepperRef.current?.goTo(0)}
              >
                {m._builder.backToFormSelection}
              </Core.Btn>
              <Core.Btn
                sx={{mx: 0.5}}
                variant="outlined"
                color="inherit"
                icon="timer"
                onClick={() => {
                  setError(undefined)
                  setLoading(true)
                }}
              >
                {m.wait}
              </Core.Btn>
              <Core.Btn
                onClick={() => {
                  hasChanges?.(true)
                  stepperRef.current?.next()
                }}
                sx={{mx: 0.5}}
                variant="outlined"
                color="inherit"
                endIcon="arrow_forward"
              >
                {m.skip}
              </Core.Btn>
            </Box>
          </Core.Alert>
        ) : (
          <Core.Alert sx={{borderRadius: 0}} severity="error">
            {error}
          </Core.Alert>
        ))
      )}
    </Box>
  )
}
