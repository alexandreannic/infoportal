import {useAppSettings} from '@/core/context/ConfigContext'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {useCreateUser, useWorkspaceUsers} from '@/core/query/useUsersQuery'
import {IpBtn, Modal} from '@/shared'
import {AppAvatar} from '@/shared/AppAvatar'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useFetcher} from '@/shared/hook/useFetcher'
import {IpIconBtn} from '@/shared/IconBtn'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {TableIcon} from '@/shared/TableIcon'
import {Txt} from '@/shared/Txt'
import {seq} from '@axanc/ts-utils'
import {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {AddUserForm} from './AddUserForm'
import {useQuerySession} from '@/core/query/useQuerySession'

export const AdminUsers = () => {
  const {workspaceId} = useWorkspaceRouter()
  const queryUsers = useWorkspaceUsers(workspaceId)
  const queryUserCreate = useCreateUser(workspaceId)

  const {conf} = useAppSettings()
  const querySession = useQuerySession()

  const {m, formatDate, formatDateTime} = useI18n()
  const navigate = useNavigate()

  const connectAs = async (email: string) => {
    await querySession.connectAs.mutateAsync(email)
    await navigate('/')
  }

  const emailsLists = useMemo(() => queryUsers.data?.map(_ => _.email), [queryUsers.data])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          loading={queryUsers.isLoading}
          id="users"
          showExportBtn
          defaultLimit={100}
          data={queryUsers.data}
          header={
            <Modal
              onClose={null}
              title={m.addUser}
              content={close => (
                <AddUserForm
                  existingEmails={emailsLists}
                  loading={queryUserCreate.isPending}
                  onClose={close}
                  onSubmit={_ => queryUserCreate.mutateAsync(_)}
                />
              )}
            >
              <IpBtn icon="person_add" variant="contained">
                {m.addUser}
              </IpBtn>
            </Modal>
          }
          columns={[
            {
              width: 0,
              id: 'avatar',
              head: '',
              renderQuick: _ => <AppAvatar size={24} email={_.email} />,
            },
            {
              type: 'string',
              id: 'name',
              head: m.name,
              renderQuick: _ => _.name,
            },
            {
              id: 'email',
              head: m.email,
              render: _ => {
                return {
                  label: <Txt bold>{_.email}</Txt>,
                  value: _.email,
                }
              },
              type: 'string',
            },
            {
              width: 110,
              id: 'createdAt',
              head: m.createdAt,
              type: 'date',
              render: _ => {
                return {
                  label: <Txt color="hint">{formatDate(_.createdAt)}</Txt>,
                  value: _.createdAt,
                }
              },
            },
            {
              type: 'date',
              width: 140,
              id: 'lastConnectedAt',
              head: m.lastConnectedAt,
              render: _ => {
                return {
                  label: _.lastConnectedAt && <Txt color="hint">{formatDateTime(_.lastConnectedAt)}</Txt>,
                  value: _.lastConnectedAt,
                }
              },
            },
            {
              id: 'drcJob',
              head: m.drcJob,
              renderQuick: _ => _.drcJob,
              type: 'select_one',
              options: () =>
                seq(queryUsers.data?.map(_ => _.drcJob))
                  .distinct(_ => _)
                  .compact()
                  .map(_ => ({value: _, label: _})),
            },
            {
              id: 'drcOffice',
              type: 'select_one',
              head: m.location,
              renderQuick: _ => _.drcOffice,
              // options: () => seq(ctxUser.fetchSearch.get?.map(_ => _.drcOffice)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
            },
            {
              type: 'select_one',
              id: 'admin',
              width: 10,
              align: 'center',
              head: m.admin,
              render: _ => ({
                label: _.admin && <TableIcon color="success">check_circle</TableIcon>,
                value: _.admin ? 'true' : 'false',
              }),
              options: () => [
                {value: 'true', label: m.yes},
                {value: 'false', label: m.no},
              ],
            },
            {
              id: 'action',
              width: 10,
              align: 'right',
              renderQuick: _ => (
                <IpIconBtn
                  disabled={_.email === conf.contact || _.email === querySession.getMe.data?.email}
                  children="visibility"
                  loading={querySession.connectAs.isPending}
                  onClick={() => connectAs(_.email)}
                  tooltip={m.connectAs}
                />
              ),
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
