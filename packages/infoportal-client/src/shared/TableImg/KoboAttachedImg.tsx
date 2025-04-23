import {AppConfig, appConfig} from '@/conf/AppConfig'
import {TableImg} from '@/shared/TableImg/TableImg'
import {useMemo} from 'react'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk'
import {Kobo} from 'kobo-sdk'

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
  return parsedFileName ? attachments.find((_) => _.filename.includes(parsedFileName)) : undefined
}

export const getKoboAttachmentUrl = ({
  fileName,
  attachments,
  conf = appConfig,
  formId,
  answerId,
}: {
  formId: Kobo.FormId
  answerId: Kobo.SubmissionId
  fileName?: string
  attachments: Kobo.Submission.Attachment[]
  conf?: AppConfig
}) => {
  const attachment = getAttachment({fileName, attachments})
  if (attachment)
    return KoboApiSdk.getAttachementUrl({formId, answerId, attachmentId: attachment?.id, baseUrl: conf.apiURL})
}

export const KoboAttachedImg = ({
  fileName,
  attachments,
  size,
  formId,
  answerId,
  tooltipSize = 450,
}: {
  formId: Kobo.FormId
  answerId: Kobo.SubmissionId
  size?: number
  tooltipSize?: number | null
  fileName?: string
  attachments: Kobo.Submission.Attachment[]
}) => {
  const url = useMemo(() => getKoboAttachmentUrl({formId, answerId, attachments, fileName}), [attachments, fileName])
  return fileName && <TableImg size={size} tooltipSize={tooltipSize} url={url} />
}
