import {queryKeys} from '@/core/query/query.index'
import {useQuerySubmission} from '@/core/query/useQuerySubmission'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseKoboTableProvider} from '@/features/Form/Database/DatabaseContext'
import {DatabaseTableContent} from '@/features/Form/Database/DatabaseTableContent'
import {map} from '@axanc/ts-utils'
import {Skeleton} from '@mui/material'
import {useIsFetching} from '@tanstack/react-query'
import {useCallback} from 'react'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Datatable, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {FetchParams} from '@axanc/react-hooks'

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
  onDataChange?: (_: {
    data?: Submission[]
    filteredData?: Submission[]
    filteredAndSortedData?: Submission[]
    filteredSortedAndPaginatedData?: ApiPaginate<Submission>
  }) => void
  overrideEditAccess?: boolean
}

function DatabaseTableContainer() {
  const props = useFormContext()
  return (
    <Page width="full" sx={{mb: 0}}>
      <DatabaseTable
        permission={props.permission}
        formId={props.form.id}
        workspaceId={props.workspaceId}
        form={props.form}
      />
    </Page>
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
  const queryForm = useQueryFormById({workspaceId, formId}).get
  const querySchema = useQuerySchema({formId, workspaceId})
  const queryAnswers = useQuerySubmission.search({workspaceId, formId})

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
