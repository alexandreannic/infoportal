import {IpIconBtn, Page, PageTitle} from '@/shared'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Collapse} from '@mui/material'
import {useState} from 'react'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/ImportKoboForm/KoboServerForm'
import {UUID} from 'infoportal-common'
import {SelectKoboForm} from '@/features/ImportKoboForm/SelectKoboForm'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryServer} from '@/core/query/useQueryServer'

export const ImportKobo = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const dialog = useDialogs()
  const [selectedServerId, setSelectedServerId] = useState<UUID>()

  const queryServer = useQueryServer(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }

  const handleDelete = async (id: UUID) => {
    queryServer.remove.mutate({id})
  }

  return (
    <Page width="xs">
      <PageTitle>{m.importFromKobo}</PageTitle>
      <Panel>
        <PanelHead>{m.selectServer}</PanelHead>
        <PanelBody>
          <ScRadioGroup sx={{flex: 1, minWidth: 200}} dense onChange={setSelectedServerId}>
            {queryServer.getAll.data?.map(_ => (
              <ScRadioGroupItem
                value={_.id}
                title={_.name}
                description={_.url}
                endContent={
                  <IpIconBtn
                    size="small"
                    loading={queryServer.remove.isPending}
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(_.id)
                    }}
                  >
                    delete
                  </IpIconBtn>
                }
              />
            ))}
            <ScRadioGroupItem value={null} title={m.addNewKoboAccount} onClick={handleOpen} icon="add" />
          </ScRadioGroup>
        </PanelBody>
      </Panel>
      <Collapse in={!!selectedServerId} mountOnEnter unmountOnExit>
        <SelectKoboForm serverId={selectedServerId!} onAdded={() => queryServer.getAll.refetch()} />
      </Collapse>
    </Page>
  )
}
