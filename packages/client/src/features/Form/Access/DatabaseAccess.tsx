import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {DatabaseAccessForm} from '@/features/Form/Access/DatabaseAccessForm'
import {AccessTable} from '@/features/Access/AccessTable'
import {Core} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {TabContent} from '@/shared/Tab/TabContent.js'

export const databaseAccessRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'access',
  component: DatabaseAccess,
})

function DatabaseAccess() {
  const {workspaceId, permission, form, schema} = useFormContext(_ => _)
  const {m} = useI18n()
  return (
    <TabContent width="full">
      {schema && (
        <Core.Panel>
          <AccessTable
            formId={form.id}
            workspaceId={workspaceId}
            isAdmin={permission.access_canEdit}
            header={
              permission.access_canAdd && (
                <DatabaseAccessForm workspaceId={workspaceId} formId={form.id} schema={schema}>
                  <Core.Btn sx={{mr: 1}} variant="outlined" icon="person_add">
                    {m.grantAccess}
                  </Core.Btn>
                </DatabaseAccessForm>
              )
            }
          />
        </Core.Panel>
      )}
    </TabContent>
  )
}
