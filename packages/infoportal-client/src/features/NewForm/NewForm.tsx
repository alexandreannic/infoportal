import {Page} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Box, Collapse, Icon} from '@mui/material'
import {useEffect, useState} from 'react'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/NewForm/KoboServerForm'
import {SelectKoboForm} from '@/features/NewForm/SelectKoboForm'
import {useQueryServers} from '@/core/query/useQueryServers'
import {fnSwitch, Obj} from '@axanc/ts-utils'
import {NewFormCreateInternal} from '@/features/NewForm/NewFormCreateInternal'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '@/shared'
import {useQueryForm} from '@/core/query/useQueryForm'
import {UseQuerySmartDb} from '@/core/query/useQuerySmartDb'

export const newFormRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'new-form',
  component: NewForm,
})

const OptionBody = ({icon, color, label}: {color: string; icon: string; label: string}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon sx={{fontSize: 50, color}}>{icon}</Icon>
      {label}
    </Box>
  )
}

enum Source {
  internal = 'internal',
  smart = 'smart',
  kobo = 'kobo',
}

const icon = {
  [Source.internal]: 'content_paste',
  [Source.kobo]: 'cloud_download',
  [Source.smart]: 'dynamic_form',
}

const color = {
  [Source.internal]: '#FF9800',
  [Source.kobo]: '#2196F3',
  [Source.smart]: '#9C27B0',
}

function NewForm() {
  const {m} = useI18n()
  const {workspaceId} = newFormRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const {setTitle} = useLayoutContext()
  const dialog = useDialogs()
  const navigate = useNavigate()

  const [source, setSource] = useState<Source>()
  const [selectedServerId, setSelectedServerId] = useState<Ip.ServerId>()

  const queryForm = useQueryForm(workspaceId)
  const queryServer = useQueryServers(workspaceId)
  const querySmartDb = UseQuerySmartDb.create(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }
  useEffect(() => {
    setTitle(m.newForm)
    return () => setTitle('')
  }, [])

  return (
    <Page width="xs">
      <Core.Panel>
        <Core.PanelHead>{m.source}</Core.PanelHead>
        <Core.PanelBody>
          <Core.RadioGroup value={source} sx={{flex: 1}} inline onChange={setSource}>
            {Obj.keys(Source).map(source => (
              <Core.RadioGroupItem
                key={source}
                hideRadio
                value={source}
                title={<OptionBody color={color[source]} icon={icon[source]} label={m.formSource[source]} />}
                sx={{flex: 1}}
              />
            ))}
          </Core.RadioGroup>
        </Core.PanelBody>
      </Core.Panel>
      {source &&
        fnSwitch(
          source,
          {
            kobo: (
              <>
                <Core.Panel>
                  <Core.PanelHead>{m.selectAccount}</Core.PanelHead>
                  <Core.PanelBody>
                    <Core.RadioGroup sx={{flex: 1, minWidth: 200}} dense onChange={setSelectedServerId}>
                      {queryServer.getAll.data?.map(_ => (
                        <Core.RadioGroupItem
                          key={_.id}
                          value={_.id}
                          title={_.name}
                          description={_.url}
                          // endContent={
                          //   <Core.IconBtn
                          //     size="small"
                          //     loading={queryServer.remove.isPending}
                          //     onClick={e => {
                          //       e.stopPropagation()
                          //       handleDelete(_.id)
                          //     }}
                          //   >
                          //     delete
                          //   </Core.IconBtn>
                          // }
                        />
                      ))}
                      <Core.RadioGroupItem value={null} title={m.addNewKoboAccount} onClick={handleOpen} icon="add" />
                    </Core.RadioGroup>
                  </Core.PanelBody>
                </Core.Panel>
                <Collapse in={!!selectedServerId} mountOnEnter unmountOnExit>
                  <SelectKoboForm
                    workspaceId={workspaceId}
                    serverId={selectedServerId!}
                    onAdded={() => queryServer.getAll.refetch()}
                  />
                </Collapse>
              </>
            ),
            internal: (
              <NewFormCreateInternal
                workspaceId={workspaceId}
                loading={queryForm.create.isPending}
                btnLabel={m.create + ' ' + m.formSource[source].toLowerCase()}
                onSubmit={async form => {
                  const newForm = await queryForm.create.mutateAsync(form)
                  navigate({to: '/$workspaceId/form/$formId', params: {workspaceId, formId: newForm.id}})
                }}
              />
            ),
            smart: (
              <NewFormCreateInternal
                workspaceId={workspaceId}
                btnLabel={m.create + ' ' + m.formSource[source].toLowerCase()}
                loading={queryForm.create.isPending}
                onSubmit={async form => {
                  const newSmartDb = await querySmartDb.mutateAsync(form)
                  navigate({
                    to: '/$workspaceId/form/smart-db/$smartDbId',
                    params: {workspaceId, smartDbId: newSmartDb.id},
                  })
                }}
              />
            ),
          },
          () => <></>,
        )}
    </Page>
  )
}
