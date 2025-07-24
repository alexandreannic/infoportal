import {queryKeys} from '@/core/query/query.index'
import {useQuerySubmission} from '@/core/query/useQuerySubmission'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseKoboTableProvider} from '@/features/Form/Database/DatabaseContext'
import {DatabaseTableContent} from '@/features/Form/Database/DatabaseTableContent'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {DatatableFilterValue} from '@/shared/Datatable/util/datatableType'
import {FetchParams} from '@/shared/hook/useFetchers'
import {Panel} from '@/shared/Panel'
import {map} from '@axanc/ts-utils'
import {Skeleton} from '@mui/material'
import {useIsFetching} from '@tanstack/react-query'
import {Kobo} from 'kobo-sdk'
import {useCallback} from 'react'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'

export const answersRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'answers',
  component: DatabaseTableContainer,
})

export interface DatabaseTableProps {
  workspaceId: UUID
  form?: Ip.Form
  formId: Kobo.FormId
  permission: Ip.Permission.Form
  dataFilter?: (_: Submission) => boolean
  onFiltersChange?: (_: Record<string, DatatableFilterValue>) => void
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
    <Page width="full">
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
      queryKey: queryKeys.koboSchema(formId),
    }) > 0

  return (
    <Panel>
      {anyLoading && loading && (
        <>
          <Skeleton sx={{mx: 1, height: 54}} />
          <DatatableSkeleton />
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
    </Panel>
  )
}
