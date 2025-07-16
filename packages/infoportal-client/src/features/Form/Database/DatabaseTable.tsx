import {queryKeys} from '@/core/query/query.index'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {useSession} from '@/core/Session/SessionContext'
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
import {useCallback, useMemo} from 'react'
import {useQueryAccess} from '@/core/query/useQueryAccess'
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
  dataFilter?: (_: KoboMappedAnswer) => boolean
  onFiltersChange?: (_: Record<string, DatatableFilterValue>) => void
  onDataChange?: (_: {
    data?: KoboMappedAnswer[]
    filteredData?: KoboMappedAnswer[]
    filteredAndSortedData?: KoboMappedAnswer[]
    filteredSortedAndPaginatedData?: ApiPaginate<KoboMappedAnswer>
  }) => void
  overrideEditAccess?: boolean
}

function DatabaseTableContainer() {
  const props = useFormContext()
  return (
    <Page width="full">
      <DatabaseTable formId={props.form.id} workspaceId={props.workspaceId} form={props.form} />
    </Page>
  )
}

const DatabaseTable = ({
  workspaceId,
  formId,
  onFiltersChange,
  onDataChange,
  dataFilter,
  overrideEditAccess,
}: DatabaseTableProps) => {
  const session = useSession()

  const queryForm = useQueryFormById({workspaceId, formId}).get
  const querySchema = useQuerySchema({formId, workspaceId})
  const queryAnswers = useQueryAnswer({workspaceId, formId})
  const queryAccess = useQueryAccess(workspaceId)

  const access = useMemo(() => {
    const list = queryAccess.accessesByFormIdMap[formId] ?? []
    const admin = session.user.admin || !!list.find(_ => _.level === Ip.AccessLevel.Admin)
    const write = admin || !!list.find(_ => _.level === Ip.AccessLevel.Write)
    const read = write || list.length > 0
    return {admin, write, read}
  }, [queryAccess.accessesByFormIdMap])

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
          access={access}
          refetch={refetch}
          loading={loading}
          data={queryAnswers.data?.data}
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
