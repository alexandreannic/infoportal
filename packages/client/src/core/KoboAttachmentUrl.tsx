import {AppConfig, appConfig} from '@/conf/AppConfig.js'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk.js'
import {Kobo} from 'kobo-sdk'
import {Api} from '@infoportal/api-sdk'
import {useMemo} from 'react'
import {Datatable} from '@/shared'

const parseKoboFileName = (fileName?: string) =>
  fileName ? fileName.replaceAll(' ', '_').replaceAll(/[^0-9a-zA-Z-_.\u0400-\u04FF]/g, '') : undefined

const getAttachment = ({
  fileName,
  attachments = [],
}: {
  fileName?: string
  attachments: Kobo.Submission.Attachment[]
}): Kobo.Submission.Attachment | undefined => {
  const parsedFileName = parseKoboFileName(fileName)
  return parsedFileName ? attachments.find(_ => _.filename.includes(parsedFileName)) : undefined
}

export const getKoboAttachmentUrl = ({
  fileName,
  attachments,
  conf = appConfig,
  formId,
  submissionId,
}: {
  formId: Api.FormId
  submissionId: Api.SubmissionId
  fileName?: string
  attachments: Kobo.Submission.Attachment[]
  conf?: AppConfig
}) => {
  const attachment = getAttachment({fileName, attachments})
  if (attachment)
    return KoboApiSdk.getAttachmentUrl({
      formId,
      answerId: submissionId,
      // Seems Kobo change .id to .uid. Update SDK
      attachmentId: attachment.uid,
      baseUrl: conf.apiURL,
    })
}

export const KoboAttachedImg = ({
  fileName,
  attachments,
  size,
  formId,
  submissionId,
  tooltipSize = 450,
}: {
  formId: Api.FormId
  submissionId: Api.SubmissionId
  size?: number
  tooltipSize?: number | null
  fileName?: string
  attachments: Kobo.Submission.Attachment[]
}) => {
  const url = useMemo(
    () => getKoboAttachmentUrl({formId, submissionId, attachments, fileName}),
    [attachments, fileName],
  )
  return fileName && <Datatable.Img size={size} tooltipSize={tooltipSize} url={url} />
}
