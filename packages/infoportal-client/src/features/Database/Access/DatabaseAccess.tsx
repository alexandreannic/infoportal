import React, {useMemo} from 'react'
import {Access, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {useI18n} from '@/core/i18n'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {IpBtn} from '@/shared/Btn'
import {DatabaseAccessForm} from '@/features/Database/Access/DatabaseAccessForm'
import {Panel} from '@/shared/Panel'
import {AccessTable} from '@/features/Access/AccessTable'
import {useQueryAccess} from '@/core/query/useQueryAccess'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryKoboSchema} from '@/core/query/useQueryKoboSchema'
import {useSession} from '@/core/Session/SessionContext'
import {Page} from '@/shared'

export const DatabaseAccess = () => {
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {user} = useSession()

  const queryAccess = useQueryAccess(workspaceId)
  const querySchema = useQueryKoboSchema(formId)

  const accessSum = useMemo(() => {
    return Access.toSum(queryAccess.accessesByFormIdMap[formId] ?? [], user.admin)
  }, [user, queryAccess.getKoboAccess])

  const refresh = () => {
    queryAccess.getAll.refetch()
  }

  return querySchema.data && accessSum ? (
    <Page width="full">
      <Panel>
        <AccessTable
          isAdmin={accessSum.admin}
          renderParams={(_: KoboDatabaseAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            accessSum.admin && (
              <DatabaseAccessForm
                workspaceId={workspaceId}
                formId={formId}
                form={querySchema.data.schema}
                onAdded={refresh}
              >
                <IpBtn sx={{mr: 1}} variant="outlined" icon="person_add">
                  {m.grantAccess}
                </IpBtn>
              </DatabaseAccessForm>
            )
          }
        />
      </Panel>
    </Page>
  ) : (
    <></>
  )
}
