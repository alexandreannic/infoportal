import React, {useState} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Chip, Icon} from '@mui/material'
import {useForm} from 'react-hook-form'
import {accessLevelIcon, IAccessForm} from '@/features/Access/AccessForm'
import {SettingsGroupAccessForm} from '@/features/Settings/SettingsGroupAccessForm'
import {Core, Datatable} from '@/shared'
import {useQueryGroup} from '@/core/query/useQueryGroup'
import {createRoute} from '@tanstack/react-router'
import {settingsRoute} from '@/features/Settings/Settings'
import {Ip} from '@infoportal/api-sdk'
import {useWorkspaceContext} from '@/features/Workspace/Workspace'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {SettingsGroupCreateForm} from '@/features/Settings/SettingsGroupCreateForm.js'

export const settingsGroupsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'group',
  component: SettingsGroups,
})

export interface GroupCreateForm {
  name: string
  desc?: string
}

function SettingsGroups() {
  const {m, formatDateTime} = useI18n()
  const {permission, workspace, workspaceId} = useWorkspaceContext()
  const groupForm = useForm<GroupCreateForm>()
  const accessForm = useForm<IAccessForm>()
  const query = useQueryGroup(workspaceId)
  const queryGet = query.getAll

  const [selectedGroupId, setSelectedGroupId] = useState<
    | {
        groupId: Ip.GroupId
        itemId?: Ip.Group.ItemId
      }
    | undefined
  >()

  return (
    <TabContent width="full">
      <Core.Panel>
        <Datatable.Component
          rowHeight={36}
          getRowKey={_ => _.id}
          data={queryGet.data}
          loading={queryGet.isLoading}
          id="group"
          header={
            permission.group_canCreate && (
              <Core.Modal
                onOpen={groupForm.reset}
                onConfirm={(e, close) =>
                  groupForm.handleSubmit(form => {
                    query.create.mutateAsync(form).then(close)
                  })()
                }
                title={m._admin.createGroup}
                content={<SettingsGroupCreateForm form={groupForm} />}
              >
                <Core.Btn icon="add" variant="outlined">
                  {m.create}
                </Core.Btn>
              </Core.Modal>
            )
          }
          columns={[
            {
              type: 'select_one',
              id: 'name',
              width: 150,
              head: m.name,
              renderQuick: _ => _.name,
            },
            {
              type: 'string',
              id: 'desc',
              width: 120,
              head: m.desc,
              renderQuick: _ => _.desc,
            },
            {
              type: 'date',
              id: 'createdAt',
              width: 80,
              head: m.createdAt,
              render: _ => {
                return {
                  label: formatDateTime(_.createdAt),
                  value: _.createdAt,
                }
              },
            },
            {
              id: 'items',
              style: () => ({whiteSpace: 'normal'}),
              head: m.accesses,
              renderQuick: _ => (
                <>
                  {_.items.map(item => (
                    <Chip
                      onClick={
                        permission.group_canUpdate
                          ? () => {
                              accessForm.reset({
                                ...item,
                                job: item.job ? [item.job] : undefined,
                              })
                              setSelectedGroupId({groupId: _.id, itemId: item.id})
                            }
                          : undefined
                      }
                      onDelete={e => query.deleteItem.mutate({id: item.id})}
                      sx={{mr: 0.5, my: 0.25}}
                      icon={<Icon>{accessLevelIcon[item.level]}</Icon>}
                      size="small"
                      key={item.id}
                      label={
                        <>
                          {item.job ?? item.email}
                          {item.location ? ` (${item.location})` : ''}
                        </>
                      }
                    />
                  ))}
                  <Chip
                    icon={<Icon>add</Icon>}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => setSelectedGroupId({groupId: _.id})}
                    sx={{
                      borderStyle: 'dotted',
                      // borderWidth: 2
                    }}
                  />
                </>
              ),
            },
            {
              id: 'actions',
              width: 90,
              align: 'right',
              renderQuick: _ => (
                <>
                  <Core.Modal
                    onOpen={groupForm.reset}
                    loading={query.update.isPending}
                    onConfirm={(e, close) =>
                      groupForm.handleSubmit(form => {
                        query.update
                          .mutateAsync({
                            ...form,
                            id: _.id,
                          })
                          .then(close)
                      })()
                    }
                    title={m.edit}
                    confirmLabel={m.edit}
                    content={<SettingsGroupCreateForm form={groupForm} defaultValue={{desc: _.desc, name: _.name}} />}
                  >
                    <Core.IconBtn size="small">edit</Core.IconBtn>
                  </Core.Modal>
                  <Core.IconBtn
                    size="small"
                    tooltip={m.duplicate}
                    onClick={() => query.duplicate.mutate(_)}
                    loading={query.duplicate.isPending}
                  >
                    content_copy
                  </Core.IconBtn>
                  <Core.IconBtn
                    size="small"
                    tooltip={m.remove}
                    onClick={() => query.remove.mutate({id: _.id})}
                    loading={query.remove.isPending}
                  >
                    delete
                  </Core.IconBtn>
                </>
              ),
            },
          ]}
        />
        <Core.BasicDialog
          open={!!selectedGroupId}
          loading={query.createItem.isPending}
          onClose={() => setSelectedGroupId(undefined)}
          confirmDisabled={!accessForm.formState.isValid}
          onConfirm={e =>
            accessForm.handleSubmit(f => {
              if (selectedGroupId?.itemId) {
                query.updateItem.mutate({
                  ...f,
                  job: f.job?.[0] ?? null,
                  id: selectedGroupId?.itemId,
                })
              } else if (selectedGroupId?.groupId) {
                query.createItem.mutate({
                  ...f,
                  jobs: f.job,
                  groupId: selectedGroupId?.groupId!,
                })
              } else {
                throw new Error(`Missing selectedGroupId: ${JSON.stringify(selectedGroupId)}`)
              }
              setSelectedGroupId(undefined)
            })()
          }
        >
          <Box sx={{width: 400}}>
            <SettingsGroupAccessForm form={accessForm} workspaceId={workspaceId} />
          </Box>
        </Core.BasicDialog>
      </Core.Panel>
    </TabContent>
  )
}
