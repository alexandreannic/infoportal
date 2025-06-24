import {ApiClient} from '@/core/sdk/server/ApiClient'
import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {FormVersion} from '@prisma/client'

type Schema = Omit<FormVersion, 'schema'> & {
  schema: Kobo.Form['content']
}

export type PyxformResponse = {
  code: number
  message: string
  warnings?: string[]
}

export type SchemaDetails = {
  active: Schema
  last: Schema
  all: Pick<Schema, 'id' | 'version' | 'message' | 'uploadedBy' | 'createdAt'>[]
}

export class FormVersionSdk {
  constructor(private client: ApiClient) {}

  readonly validateXlsForm = ({
    workspaceId,
    formId,
    xlsFile,
  }: {
    workspaceId: UUID
    formId: Kobo.FormId
    xlsFile: File
  }) => {
    return this.client.postFile<PyxformResponse>(`/${workspaceId}/form/${formId}/schema/validate`, {
      uploadName: 'uf-xlsform',
      file: xlsFile,
    })
  }

  readonly uploadXlsForm = ({
    workspaceId,
    formId,
    xlsFile,
    ...rest
  }: {
    workspaceId: UUID
    formId: Kobo.FormId
    xlsFile: File
    message?: string
  }) => {
    return this.client.postFile<{
      schema: SchemaDetails
      schemaJson: Kobo.Form['content']
    }>(`/${workspaceId}/form/${formId}/schema`, {
      uploadName: 'uf-xlsform',
      file: xlsFile,
      ...rest,
    })
  }

  readonly get = ({workspaceId, formId}: {workspaceId: UUID; formId: Kobo.FormId}) => {
    return this.client.get<SchemaDetails>(`/${workspaceId}/form/${formId}/schema`)
  }
}
