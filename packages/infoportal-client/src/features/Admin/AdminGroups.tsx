import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {IpBtn} from '@/shared/Btn'
import {Panel} from '@/shared/Panel'
import {Box, Chip, Icon} from '@mui/material'
import {Modal} from '@/shared/Modal'
import {IpInput} from '@/shared/Input/Input'
import {useForm} from 'react-hook-form'
import {useAsync} from '@/shared/hook/useAsync'
import {IpIconBtn} from '@/shared/IconBtn'
import {IAccessForm} from '@/features/Access/AccessForm'
import {accessLevelIcon} from '@/core/sdk/server/access/Access'
import {AdminGroupAccessForm} from '@/features/Admin/AdminGroupAccessForm'
import {BasicDialog} from '@/shared/BasicDialog'
import {nullValuesToUndefined, UUID} from 'infoportal-common'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Group} from '@/core/sdk/server/group/GroupItem'
import {Datatable} from '@/shared/Datatable/Datatable'

interface GoupForm {
  name: string
  desc?: string
}

export const AdminGroups = () => {
  const {api} = useAppSettings()
  const {m, formatDate, formatDateTime} = useI18n()

  const groupForm = useForm<GoupForm>()
  const accessForm = useForm<IAccessForm>()

  const fetcher = useFetcher(api.group.search)
  const asyncCreate = useAsync(api.group.create)
  const asyncUpdate = useAsync(api.group.update)
  const asyncRemove = useAsync(api.group.remove, {requestKey: (_) => _[0]})
  const asyncItemCreate = useAsync(api.group.createItem)
  const asyncItemItem = useAsync(api.group.updateItem)
  const asyncItemDelete = useAsync(api.group.deleteItem, {requestKey: (_) => _[0]})
  const asyncDuplicate = useAsync(
    async (g: Group) => {
      const {id, items, createdAt, name, ...params} = g
      const newGroup = await asyncCreate.call({
        name: `${name} (copy)`,
        ...params,
      })
      await Promise.all(
        items.map((item) => {
          return api.group.createItem(newGroup.id, {
            ...item,
            drcJob: item.drcJob ? [item.drcJob] : undefined,
          })
        }),
      )
    },
    {requestKey: (_) => _[0].id},
  )

  const [selectedGroupId, setSelectedGroupId] = useState<
    | {
        groupId: UUID
        accessId?: UUID
      }
    | undefined
  >()

  useEffect(() => {
    fetcher.fetch()
  }, [])

  useEffect(() => {
    fetcher.fetch({force: true, clean: false})
  }, [
    asyncCreate.callIndex,
    asyncUpdate.callIndex,
    asyncRemove.callIndex,
    asyncItemDelete.callIndex,
    asyncItemItem.callIndex,
    asyncItemCreate.callIndex,
  ])

  return (
    <Page width="lg">
      <Panel>
        <Datatable
          data={fetcher.get}
          loading={fetcher.loading}
          id="group"
          header={
            <>
              <Modal
                onOpen={groupForm.reset}
                onConfirm={(e, close) =>
                  groupForm.handleSubmit((form) => {
                    asyncCreate.call(form).then(close)
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
              renderQuick: (_) => _.name,
            },
            {
              type: 'string',
              id: 'desc',
              width: 120,
              head: m.desc,
              renderQuick: (_) => _.desc,
            },
            {
              type: 'date',
              id: 'createdAt',
              width: 80,
              head: m.createdAt,
              render: (_) => {
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
              renderQuick: (_) => (
                <>
                  {_.items.map((item) => (
                    <Chip
                      onClick={() => {
                        accessForm.reset({
                          ...item,
                          drcJob: item.drcJob ? [item.drcJob] : undefined,
                        })
                        setSelectedGroupId({groupId: _.id, accessId: item.id})
                      }}
                      onDelete={(e) => asyncItemDelete.call(item.id)}
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
              renderQuick: (_) => (
                <>
                  <Modal
                    onOpen={groupForm.reset}
                    onConfirm={(e, close) =>
                      groupForm.handleSubmit((form) => {
                        asyncUpdate.call(_.id, form).then(close)
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
                    onClick={() => asyncDuplicate.call(_)}
                    loading={asyncDuplicate.loading[_.id]}
                  >
                    content_copy
                  </IpIconBtn>
                  <IpIconBtn
                    size="small"
                    tooltip={m.remove}
                    onClick={() => asyncRemove.call(_.id)}
                    loading={asyncRemove.loading[_.id]}
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
          loading={asyncItemCreate.loading}
          onClose={() => setSelectedGroupId(undefined)}
          confirmDisabled={!accessForm.formState.isValid}
          onConfirm={(e) =>
            accessForm.handleSubmit((f) => {
              if (selectedGroupId?.accessId) {
                asyncItemItem.call(selectedGroupId.accessId, {
                  ...f,
                  drcJob: f.drcJob?.[0] ?? null,
                })
              } else asyncItemCreate.call(selectedGroupId?.groupId!, nullValuesToUndefined(f))
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
