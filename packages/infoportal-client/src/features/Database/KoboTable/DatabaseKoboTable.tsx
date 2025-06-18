import {useAppSettings} from '@/core/context/ConfigContext'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {queryKeys} from '@/core/query/store'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {useSession} from '@/core/Session/SessionContext'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {DatabaseKoboTableProvider} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {DatabaseKoboTableContent} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {DatatableFilterValue} from '@/shared/Datatable/util/datatableType'
import {useFetcher} from '@/shared/hook/useFetcher'
import {FetchParams} from '@/shared/hook/useFetchers'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {map} from '@axanc/ts-utils'
import {Skeleton} from '@mui/material'
import {useIsFetching} from '@tanstack/react-query'
import {Kobo} from 'kobo-sdk'
import {useCallback, useEffect, useMemo} from 'react'
import {useParams} from 'react-router'

export const DatabaseTableRoute = () => {
  const ctx = useDatabaseContext()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  return (
    <>
      {map(ctx.getForm(formId), form => (
        <Page width="full" sx={{p: 0, pb: 0, mb: 0}}>
          <Panel sx={{mb: 0}}>
            <DatabaseTable form={form} formId={formId} />
          </Panel>
        </Page>
      ))}
    </>
  )
}

export interface DatabaseTableProps {
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
  form,
  formId,
  onFiltersChange,
  onDataChange,
  dataFilter,
  overrideEditAccess,
}: DatabaseTableProps) => {
  const {api} = useAppSettings()
  const {session} = useSession()
  const {workspaceId} = useWorkspaceRouter()

  const querySchema = useQuerySchema(formId)

  const queryAnswers = useQueryAnswer(formId)

  const fetcherForm = useFetcher(() => (form ? Promise.resolve(form) : api.kobo.form.get({workspaceId, formId})))

  const access = useMemo(() => {
    const list = session.accesses
      .filter(Access.filterByFeature(AppFeatureId.kobo_database))
      .filter(_ => _.params?.koboFormId === formId)
    const admin = session.user.admin || !!list.find(_ => _.level === AccessLevel.Admin)
    const write = admin || !!list.find(_ => _.level === AccessLevel.Write)
    const read = write || list.length > 0
    return {admin, write, read}
  }, [session.accesses])

  useEffect(() => {
    fetcherForm.fetch()
  }, [formId])

  const loading = queryAnswers.isLoading
  const refetch = useCallback(
    async (p: FetchParams = {}) => {
      await queryAnswers.refetch()
    },
    [formId],
  )

  const anyLoading =
    useIsFetching({
      queryKey: queryKeys.formSchema(),
    }) > 0

  return (
    <>
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
      {map(fetcherForm.get, querySchema.data, (form, schema) => (
        <DatabaseKoboTableProvider
          schema={schema}
          dataFilter={dataFilter}
          access={access}
          refetch={refetch}
          loading={loading}
          data={queryAnswers.data?.data}
          form={form}
        >
          <DatabaseKoboTableContent onFiltersChange={onFiltersChange} onDataChange={onDataChange} />
        </DatabaseKoboTableProvider>
      ))}
    </>
  )
}
