import {UseQuerySubmission} from '@/core/query/form/useQuerySubmission'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseKoboTableProvider} from '@/features/Form/Database/DatabaseContext'
import {DatabaseTableContent} from '@/features/Form/Database/DatabaseTableContent'
import {Skeleton} from '@mui/material'
import {useCallback} from 'react'
import {Ip} from '@infoportal/api-sdk'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Datatable} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {FetchParams} from '@axanc/react-hooks'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'

export const answersRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'answers',
  component: DatabaseTableContainer,
})

export interface DatabaseTableProps {
  workspaceId: Ip.WorkspaceId
  schema?: KoboSchemaHelper.Bundle<false>
  form: Ip.Form
  formId: Ip.FormId
  permission: Ip.Permission.Form
  dataFilter?: (_: Submission) => boolean
  onFiltersChange?: (_: Record<string, Datatable.FilterValue>) => void
  onDataChange?: (_: {data?: Submission[]; filteredAndSortedData?: Submission[]}) => void
  overrideEditAccess?: boolean
}

function DatabaseTableContainer() {
  const props = useFormContext(_ => _)
  return (
    <TabContent width="full" sx={{mb: 0}}>
      <DatabaseTable
        permission={props.permission}
        formId={props.form.id}
        schema={props.schema}
        workspaceId={props.workspaceId}
        form={props.form}
      />
    </TabContent>
  )
}

const DatabaseTable = ({
  workspaceId,
  formId,
  schema,
  form,
  onFiltersChange,
  onDataChange,
  dataFilter,
  permission,
  overrideEditAccess,
}: DatabaseTableProps) => {
  const queryAnswers = UseQuerySubmission.search({workspaceId, formId})

  const refetch = useCallback(
    async (p: FetchParams = {}) => {
      await queryAnswers.refetch()
    },
    [formId],
  )

  return (
    <>
      {queryAnswers.isPending && (
        <>
          <Skeleton sx={{mx: 1, height: 54}} />
          <Datatable.Skeleton />
        </>
      )}
      {schema && (
        <DatabaseKoboTableProvider
          form={form}
          dataFilter={dataFilter}
          refetch={refetch}
          loading={queryAnswers.isPending}
          data={queryAnswers.data?.data}
          schema={schema}
          permission={permission}
        >
          <DatabaseTableContent onFiltersChange={onFiltersChange} onDataChange={onDataChange} />
        </DatabaseKoboTableProvider>
      )}
    </>
  )
}
