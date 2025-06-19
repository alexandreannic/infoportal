import {useAppSettings} from '@/core/context/ConfigContext'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {queryKeys} from '@/core/query/query.index'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {AccessLevel} from '@/core/sdk/server/access/Access'
import {KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {useSession} from '@/core/Session/SessionContext'
import {DatabaseKoboTableProvider} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {DatabaseKoboTableContent} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {DatatableFilterValue} from '@/shared/Datatable/util/datatableType'
import {useFetcher} from '@/shared/hook/useFetcher'
import {FetchParams} from '@/shared/hook/useFetchers'
import {Panel} from '@/shared/Panel'
import {map} from '@axanc/ts-utils'
import {Skeleton} from '@mui/material'
import {useIsFetching} from '@tanstack/react-query'
import {Kobo} from 'kobo-sdk'
import {useCallback, useEffect, useMemo} from 'react'
import {useQueryAccess} from '@/core/query/useQueryAccess'
import {useQueryForm} from '@/core/query/useQueryForm'
import {UUID} from 'infoportal-common'

export interface DatabaseTableProps {
  workspaceId: UUID
  form?: KoboForm
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

export const DatabaseTable = ({
  workspaceId,
  form,
  formId,
  onFiltersChange,
  onDataChange,
  dataFilter,
  overrideEditAccess,
}: DatabaseTableProps) => {
  const {session} = useSession()

  const queryForm = useQueryForm(workspaceId)
  const querySchema = useQuerySchema(formId)
  const queryAnswers = useQueryAnswer(formId)
  const queryAccess = useQueryAccess(formId)

  const access = useMemo(() => {
    const list = queryAccess.accessesByFormIdMap[formId] ?? []
    const admin = session.user.admin || !!list.find(_ => _.level === AccessLevel.Admin)
    const write = admin || !!list.find(_ => _.level === AccessLevel.Write)
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
      queryKey: queryKeys.schema(),
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
      {map(queryForm.getForm(formId), querySchema.data, (form, schema) => (
        <DatabaseKoboTableProvider
          form={form}
          schema={schema}
          dataFilter={dataFilter}
          access={access}
          refetch={refetch}
          loading={loading}
          data={queryAnswers.data?.data}
        >
          <DatabaseKoboTableContent onFiltersChange={onFiltersChange} onDataChange={onDataChange} />
        </DatabaseKoboTableProvider>
      ))}
    </Panel>
  )
}
