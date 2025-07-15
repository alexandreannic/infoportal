import React, {useMemo} from 'react'
import {Access} from '@/core/sdk/server/access/Access'
import {useI18n} from '@/core/i18n'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {IpBtn} from '@/shared/Btn'
import {DatabaseAccessForm} from '@/features/Form/Access/DatabaseAccessForm'
import {Panel} from '@/shared/Panel'
import {AccessTable} from '@/features/Access/AccessTable'
import {useQueryAccess} from '@/core/query/useQueryAccess'
import {useSession} from '@/core/Session/SessionContext'
import {Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'

export const databaseAccessRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'access',
  component: DatabaseAccess,
})

function DatabaseAccess() {
  const {workspaceId, form, schema} = useFormContext()
  const {m} = useI18n()
  const {user} = useSession()

  const queryAccess = useQueryAccess(workspaceId)

  const accessSum = useMemo(() => {
    return Access.toSum(queryAccess.accessesByFormIdMap[form.id] ?? [], user.admin)
  }, [user, queryAccess.accessesByFormIdMap])

  const refresh = () => {
    queryAccess.getAll.refetch()
  }

  return (
    <Page width="full">
      {accessSum && schema && (
        <Panel>
          <AccessTable
            workspaceId={workspaceId}
            isAdmin={accessSum.admin}
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
