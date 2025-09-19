import {queryKeys} from '@/core/query/query.index'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseKoboTableProvider} from '@/features/Form/Database/DatabaseContext'
import {DatabaseTableContent} from '@/features/Form/Database/DatabaseTableContent'
import {map} from '@axanc/ts-utils'
import {Skeleton} from '@mui/material'
import {useIsFetching} from '@tanstack/react-query'
import {useCallback} from 'react'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Datatable} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {FetchParams} from '@axanc/react-hooks'
import {TabContent} from '@/shared/Tab/TabContent.js'

export const answersRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'answers',
  component: DatabaseTableContainer,
})

export interface DatabaseTableProps {
  workspaceId: Ip.WorkspaceId
  form?: Ip.Form
  formId: Ip.FormId
  permission: Ip.Permission.Form
  dataFilter?: (_: Submission) => boolean
  onFiltersChange?: (_: Record<string, Datatable.FilterValue>) => void
  onDataChange?: (_: {data?: Submission[]; filteredAndSortedData?: Submission[]}) => void
  overrideEditAccess?: boolean
}

function DatabaseTableContainer() {
  const props = useFormContext()
  return (
    <TabContent width="full" sx={{mb: 0}}>
      <DatabaseTable
        permission={props.permission}
        formId={props.form.id}
        workspaceId={props.workspaceId}
        form={props.form}
      />
    </TabContent>
  )
}

const DatabaseTable = ({
  workspaceId,
  formId,
  onFiltersChange,
  onDataChange,
  dataFilter,
  permission,
  overrideEditAccess,
}: DatabaseTableProps) => {
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const querySchema = useQuerySchema({formId, workspaceId})
  const queryAnswers = UseQuerySubmission.search({workspaceId, formId})

  const loading = queryAnswers.isLoading
  const refetch = useCallback(
    async (p: FetchParams = {}) => {
      await queryAnswers.refetch()
    },
    [formId],
  )

  const anyLoading =
    useIsFetching({
      queryKey: queryKeys.schema(workspaceId, formId),
    }) > 0

  return (
    <>
      {anyLoading && loading && (
        <>
          <Skeleton sx={{mx: 1, height: 54}} />
          <Datatable.Skeleton />
        </>
      )}
      {/*{(ctxSchema.anyLoading || loading) && !ctxAnswers.byId.get(formId) && (*/}
      {/*  <>*/}
      {/*  </>*/}
      {/*)}*/}
      {map(queryForm.data, querySchema.data, (form, schema) => (
        <DatabaseKoboTableProvider
          form={form}
          schema={schema}
          dataFilter={dataFilter}
          refetch={refetch}
          loading={loading}
          data={queryAnswers.data?.data}
          permission={permission}
        >
          <DatabaseTableContent
            workspaceId={workspaceId}
            onFiltersChange={onFiltersChange}
            onDataChange={onDataChange}
          />
        </DatabaseKoboTableProvider>
      ))}
    </>
  )
}
