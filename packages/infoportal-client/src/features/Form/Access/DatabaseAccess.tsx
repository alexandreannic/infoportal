import React, {useMemo} from 'react'
import {Access, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {useI18n} from '@/core/i18n'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation, useFormContext} from '@/features/Form/Form'
import {IpBtn} from '@/shared/Btn'
import {DatabaseAccessForm} from '@/features/Form/Access/DatabaseAccessForm'
import {Panel} from '@/shared/Panel'
import {AccessTable} from '@/features/Access/AccessTable'
import {useQueryAccess} from '@/core/query/useQueryAccess'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useSession} from '@/core/Session/SessionContext'
import {Page} from '@/shared'

export const DatabaseAccess = () => {
  const {workspaceId, form, schema} = useFormContext()
  const {m} = useI18n()
  const {user} = useSession()

  const queryAccess = useQueryAccess(workspaceId)

  const accessSum = useMemo(() => {
    return Access.toSum(queryAccess.accessesByFormIdMap[form.id] ?? [], user.admin)
  }, [user, queryAccess.getKoboAccess])

  const refresh = () => {
    queryAccess.getAll.refetch()
  }

  return (
    <Page width="full">
      {accessSum && schema && (
        <Panel>
          <AccessTable
            isAdmin={accessSum.admin}
            renderParams={(_: KoboDatabaseAccessParams) => JSON.stringify(_.filters)}
            onRemoved={refresh}
            header={
              accessSum.admin && (
                <DatabaseAccessForm workspaceId={workspaceId} formId={form.id} form={schema.schema} onAdded={refresh}>
                  <IpBtn sx={{mr: 1}} variant="outlined" icon="person_add">
                    {m.grantAccess}
                  </IpBtn>
                </DatabaseAccessForm>
              )
            }
          />
        </Panel>
      )}
    </Page>
  )
}
