import {AppConfig, appConfig} from '@/conf/AppConfig'
import {TableImg} from '@/shared/TableImg/TableImg'
import {useMemo} from 'react'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk'
import {Kobo} from 'kobo-sdk'

export const proxyKoboImg = ({
  formId,
  url,
  fileName,
  conf = appConfig,
}: {
  formId: Kobo.FormId
  url?: string
  fileName?: string
  conf?: AppConfig
}) => {
  const path = url?.split('api')[1]
  return {
    path,
    fullUrl: path ? KoboApiSdk.getAttachementUrl({formId, path, baseUrl: conf.apiURL}) : undefined
    // fullUrl: path ? conf.apiURL + `/kobo-api/${serverId}/attachment?path=${path}&file=${fileName}` : undefined
  }
}

const parseKoboFileName = (fileName?: string) => fileName ? fileName.replaceAll(' ', '_').replaceAll(/[^0-9a-zA-Z-_.\u0400-\u04FF]/g, '') : undefined

export const findFileUrl = ({formId, answerId, fileName, attachments = []}: {
  formId: Kobo.FormId,
  answerId: Kobo.SubmissionId,
  fileName?: string,
  attachments: Kobo.Submission.Attachment[]
}) => {
  const parsedFileName = parseKoboFileName(fileName)
  const attachment = parsedFileName ? attachments.find(_ => _.filename.includes(parsedFileName)) : undefined
  if (attachment) {
    return `https://eu.kobotoolbox.org/api/v2/assets/${formId}/data/${answerId}/attachments/${attachment.id}/`
  }
  // return parsedFileName ? attachments.find(_ => _.filename.includes(parsedFileName))?.download_small_url : undefined
}

export const koboImgHelper = ({
  fileName,
  attachments,
  conf = appConfig,
  formId,
  answerId,
}: {
  formId: Kobo.FormId
  answerId: Kobo.SubmissionId
  fileName?: string,
  attachments: Kobo.Submission.Attachment[]
  conf?: AppConfig
}) => {
  const url = findFileUrl({formId, answerId, fileName, attachments})
  return proxyKoboImg({
    formId,
    url,
    fileName,
    conf,
  })
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
  const file = useMemo(() => koboImgHelper({formId, answerId, attachments, fileName}), [attachments, fileName])
  return (
    fileName && <TableImg size={size} tooltipSize={tooltipSize} url={file.fullUrl ?? ''}/>
  )
}

export const AllAttachements = ({
  attachments,
  formId,
}: {
  formId: Kobo.FormId
  attachments: Kobo.Submission.Attachment[]
}) => {
  return attachments?.map((a: Kobo.Submission.Attachment, i: number) =>
    <TableImg key={i} size={100} tooltipSize={100} url={proxyKoboImg({formId, url: a.download_url}).fullUrl ?? ''}/>
  )
}
