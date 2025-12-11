import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, useTheme} from '@mui/material'
import '@getodk/web-forms-wc'
import {Api} from '@infoportal/api-sdk'
import {SubmissionXmlToJson, SubmissionJsonToXml} from '@infoportal/form-helper'
import {EditInstanceOptions} from './EditInstance.js'

type Callback = (submission: {answers: Record<string, any>; attachments: File[]}, ev: any) => void

export interface OdkWebFormProps {
  formId: Api.FormId
  formXml: string
  fetchFormAttachment?: (path: string) => Promise<Blob>
  missingResourceBehavior?: string
  submissionMaxSize?: number
  submission?: Api.Submission
  // editInstance?: EditInstanceOptions
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
  formId,
  formXml,
  fetchFormAttachment,
  submission,
  missingResourceBehavior,
  submissionMaxSize = 5242880 * 2,
  onSubmit,
  onSubmitChunked,
  questionIndex,
}: OdkWebFormProps) {
  const [keyIndexToRemount, setKeyIndexToRemount] = useState(0)
  const t = useTheme()

  const editInstance: EditInstanceOptions | undefined = useMemo(() => {
    if (!submission) return
    const xml = new SubmissionJsonToXml(formId, questionIndex).convert(submission)
    return {
      resolveInstance: () => xml,
      attachmentFileNames: [],
      resolveAttachment: () => {
        // TODO
        return {} as any
      },
    }
  }, [submission])

  useEffect(() => {
    setKeyIndexToRemount(prev => prev + 1)
  }, [formXml, submission])

  const refCallback = useCallback(
    (element: any) => {
      if (element) {
        element.editInstance = editInstance
        element.fetchFormAttachment = fetchFormAttachment
      }
    },
    [editInstance, fetchFormAttachment],
  )

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
          '--odk-question-font-size': '1rem',
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
        '& .question-container': {
          padding: '0 .5rem .5rem .5rem',
        },
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
        ref={refCallback}
        form-xml={formXml}
        missing-resource-behavior={missingResourceBehavior}
        submission-max-size={submissionMaxSize?.toString()}
        onsubmit={handleCallback(onSubmit)}
        onsubmitchunk={handleCallback(onSubmitChunked)}
      />
    </Box>
  )
}
