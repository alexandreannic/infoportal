import React from 'react'
import {useI18n} from '@/core/i18n'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {DatabaseAccessForm} from '@/features/Form/Access/DatabaseAccessForm'
import {AccessTable} from '@/features/Access/AccessTable'
import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'

export const databaseAccessRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'access',
  component: DatabaseAccess,
})

function DatabaseAccess() {
  const {workspaceId, permission, form, schema} = useFormContext()
  const {m} = useI18n()
  return (
    <Page width="full">
      {schema && (
        <Core.Panel>
          <AccessTable
            formId={form.id}
            workspaceId={workspaceId}
            isAdmin={permission.access_canEdit}
            header={
              permission.access_canAdd && (
                <DatabaseAccessForm workspaceId={workspaceId} formId={form.id} form={schema.schema}>
                  <Core.Btn sx={{mr: 1}} variant="outlined" icon="person_add">
                    {m.grantAccess}
                  </Core.Btn>
                </DatabaseAccessForm>
              )
            }
          />
        </Core.Panel>
      )}
    </Page>
  )
}
