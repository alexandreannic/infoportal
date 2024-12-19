import {useAppSettings} from '@/core/context/ConfigContext'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {useEffect, useMemo} from 'react'
import {Box} from '@mui/material'
import {Access, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/shared/hook/useFetchers'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {Page} from '@/shared/Page'
import {IpBtn} from '@/shared/Btn'
import {useAsync} from '@/shared/hook/useAsync'
import {DatabaseAccessForm} from '@/features/Database/Access/DatabaseAccessForm'
import {Panel} from '@/shared/Panel'
import {useSession} from '@/core/Session/SessionContext'
import {AccessTable} from '@/features/Access/AccessTable'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Kobo} from 'kobo-sdk'

export const DatabaseAccessRoute = () => {
  const {api} = useAppSettings()
  const _formSchemas = useFetchers(api.koboApi.getSchema, {requestKey: ([p]) => p.id})
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const form = _formSchemas.get[formId]

  useEffect(() => {
    _formSchemas.fetch({force: true}, {id: formId})
  }, [formId])

  return (
    <Page width="lg" loading={_formSchemas.loading[formId]}>
      {form && (
        <DatabaseAccess formId={formId} form={form}/>
      )}
    </Page>
  )
}

export const DatabaseAccess = ({
  formId,
  form,
}: {
  formId: Kobo.FormId,
  form: Kobo.Form
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const {session, accesses} = useSession()

  const accessSum = useMemo(() => {
    return Access.toSum(
      accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).filter(_ => _.params?.koboFormId === formId),
      session.admin
    )
  }, [session, accesses])

  const requestInConstToFixTsInference = () => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === formId))
  const _get = useFetcher(requestInConstToFixTsInference)
  const _remove = useAsync(api.access.remove, {requestKey: _ => _[0]})

  const refresh = () => {
    _get.fetch({force: true, clean: false})
  }

  useEffect(() => {
    _get.fetch({})
  }, [formId])

  return (
    <Box>
      <Panel>
        <AccessTable
          isAdmin={accessSum.admin}
          asyncRemove={_remove}
          fetcherData={_get}
          renderParams={(_: KoboDatabaseAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            accessSum.admin && (
              <DatabaseAccessForm formId={formId} form={form} onAdded={refresh}>
                <IpBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</IpBtn>
              </DatabaseAccessForm>
            )
          }/>
      </Panel>
    </Box>
  )
}
