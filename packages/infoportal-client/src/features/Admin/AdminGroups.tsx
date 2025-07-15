import {Page} from '@/shared/Page'
import React, {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {IpBtn} from '@/shared/Btn'
import {Panel} from '@/shared/Panel'
import {Box, Chip, Icon} from '@mui/material'
import {Modal} from '@/shared/Modal'
import {IpInput} from '@/shared/Input/Input'
import {useForm} from 'react-hook-form'
import {IpIconBtn} from '@/shared/IconBtn'
import {accessLevelIcon, IAccessForm} from '@/features/Access/AccessForm'
import {AdminGroupAccessForm} from '@/features/Admin/AdminGroupAccessForm'
import {BasicDialog} from '@/shared/BasicDialog'
import {UUID} from 'infoportal-common'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useQueryGroup} from '@/core/query/useQueryGroup'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'

interface GoupForm {
  name: string
  desc?: string
}

export const AdminGroups = () => {
  const {workspaceId} = useWorkspaceRouter()
  const {m, formatDateTime} = useI18n()

  const groupForm = useForm<GoupForm>()
  const accessForm = useForm<IAccessForm>()

  const query = useQueryGroup(workspaceId)
  const queryGet = query.getAll

  const [selectedGroupId, setSelectedGroupId] = useState<
    | {
        groupId: UUID
        accessId?: UUID
      }
    | undefined
  >()

  return (
    <Page width="full">
      <Panel>
        <Datatable
          data={queryGet.data}
          loading={queryGet.isLoading}
          id="group"
          header={
            <>
              <Modal
                onOpen={groupForm.reset}
                onConfirm={(e, close) =>
                  groupForm.handleSubmit(form => {
                    query.create.mutateAsync(form).then(close)
                  })()
                }
                title={m._admin.createGroup}
                content={
                  <>
                    <IpInput sx={{mt: 2}} label={m.name} autoFocus {...groupForm.register('name')} />
                    <IpInput multiline minRows={3} maxRows={6} label={m.desc} {...groupForm.register('desc')} />
                  </>
                }
              >
                <IpBtn icon="add" variant="outlined">
                  {m.create}
                </IpBtn>
              </Modal>
            </>
          }
          columns={[
            {
              type: 'select_one',
              id: 'drcJob',
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
                      onClick={() => {
                        accessForm.reset({
                          ...item,
                          job: item.drcJob ? [item.drcJob] : undefined,
                        })
                        setSelectedGroupId({groupId: _.id, accessId: item.id})
                      }}
                      onDelete={e => query.deleteItem.mutate({id: item.id})}
                      sx={{mr: 0.5, my: 0.25}}
                      icon={<Icon>{accessLevelIcon[item.level]}</Icon>}
                      size="small"
                      key={item.id}
                      label={
                        <>
                          {item.drcJob ?? item.email}
                          {item.drcOffice ? ` (${item.drcOffice})` : ''}
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
              width: 84,
              align: 'right',
              renderQuick: _ => (
                <>
                  <Modal
                    onOpen={groupForm.reset}
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
                    title={m._admin.createGroup}
                    confirmLabel={m.edit}
                    content={
                      <>
                        <IpInput
                          sx={{mt: 2}}
                          label={m.name}
                          defaultValue={_.name}
                          autoFocus
                          {...groupForm.register('name')}
                        />
                        <IpInput
                          multiline
                          minRows={3}
                          maxRows={6}
                          defaultValue={_.desc}
                          label={m.desc}
                          {...groupForm.register('desc')}
                        />
                      </>
                    }
                  >
                    <IpIconBtn size="small">edit</IpIconBtn>
                  </Modal>
                  <IpIconBtn
                    size="small"
                    tooltip={m.duplicate}
                    onClick={() => query.duplicate.mutate(_)}
                    loading={query.duplicate.isPending}
                  >
                    content_copy
                  </IpIconBtn>
                  <IpIconBtn
                    size="small"
                    tooltip={m.remove}
                    onClick={() => query.remove.mutate({id: _.id})}
                    loading={query.remove.isPending}
                  >
                    delete
                  </IpIconBtn>
                </>
              ),
            },
          ]}
        />
        <BasicDialog
          open={!!selectedGroupId}
          loading={query.createItem.isPending}
          onClose={() => setSelectedGroupId(undefined)}
          confirmDisabled={!accessForm.formState.isValid}
          onConfirm={e =>
            accessForm.handleSubmit(f => {
              if (selectedGroupId?.accessId) {
                query.updateItem.mutate({
                  ...f,
                  drcJob: f.job?.[0] ?? null,
                  itemId: selectedGroupId?.accessId,
                })
              } else if (selectedGroupId?.groupId) {
                query.createItem.mutate({
                  ...f,
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
            <AdminGroupAccessForm form={accessForm} />
          </Box>
        </BasicDialog>
      </Panel>
    </Page>
  )
}
