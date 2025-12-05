import {useEffect, useRef, useState} from 'react'
import {Box, useTheme} from '@mui/material'
import '@getodk/web-forms-wc'
import {Api} from '@infoportal/api-sdk'
import {SubmissionXmlToJson} from '@infoportal/form-helper'

type Callback = (submission: {answers: Record<string, any>; attachments: File[]}, ev: any) => void

export interface OdkWebFormProps {
  formXml: string
  fetchFormAttachment?: (path: string) => Promise<Blob>
  missingResourceBehavior?: string
  submissionMaxSize?: number
  editInstance?: any
  onSubmit?: Callback
  onSubmitChunked?: Callback
  questionIndex: Record<string, Api.Form.Question | undefined>
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'odk-webform': any
    }
  }
}

export function OdkWebForm({
  formXml,
  fetchFormAttachment,
  missingResourceBehavior,
  submissionMaxSize = 5242880 * 2,
  editInstance,
  onSubmit,
  onSubmitChunked,
  questionIndex,
}: OdkWebFormProps) {
  const [keyIndexToRemount, setKeyIndexToRemount] = useState(0)

  const ref = useRef<any>(undefined)
  const t = useTheme()

  useEffect(() => {
    setKeyIndexToRemount(_ => _ + 1)
  }, [formXml])

  useEffect(() => {
    if (!ref.current) return
    ref.current.data = {
      fetchFormAttachment,
      editInstance,
    }
  }, [fetchFormAttachment, editInstance])

  const handleCallback = (cb?: Callback) => async (e: any) => {
    if (!cb) return
    const res = e.detail[0]?.data[0]
    if (!res) throw new Error('Cannot find submission data')
    const file: File = res.instanceFile
    const attachments = res.attachments
    const xml = await file?.text()
    const jsonSubmission = new SubmissionXmlToJson(questionIndex).convert(xml)
    cb({answers: jsonSubmission, attachments}, e)
  }

  return (
    <Box
      key={keyIndexToRemount}
      style={
        {
          '--p-primary-500': t.vars.palette.primary.main,
          '--odk-font-family': t.typography.fontFamily as string,
          '--odk-muted-background-color': 'none',
          '--p-button-border-radius': t.vars.shape.borderRadius,
          '--odk-primary-border-color': t.vars.palette.primary.main,
          '--p-button-primary-background': t.vars.palette.primary.main,
          '--p-button-primary-border-color': 'none',
          '--p-radiobutton-checked-border-color': t.vars.palette.primary.main,
          '--p-radiobutton-checked-background': 'none',
          '--p-radiobutton-icon-checked-color': t.vars.palette.primary.main,
        } as any
      }
      sx={{
        '& .odk-form .form-wrapper': {
          padding: 0,
        },
        '& .questions-card': {
          background: 'none',
        },
        '& .questions-card >.p-card-body': {
          padding: '0 !important',
        },
        '& .powered-by-wrapper': {
          paddingTop: `calc(${t.vars.spacing} * 3) !important`,
          paddingBottom: `${t.vars.spacing} !important`,
        },
        '& .form-title': {
          display: 'none',
        },
      }}
    >
      <odk-webform
        ref={ref}
        form-xml={formXml}
        missing-resource-behavior={missingResourceBehavior}
        submission-max-size={submissionMaxSize?.toString()}
        onsubmit={handleCallback(onSubmit)}
        onsubmitchunk={handleCallback(onSubmitChunked)}
      />
    </Box>
  )
}
