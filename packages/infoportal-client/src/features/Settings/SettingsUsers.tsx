import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {IpBtn, Modal} from '@/shared'
import {AppAvatar} from '@/shared/AppAvatar'
import {Datatable} from '@/shared/Datatable/Datatable'
import {IpIconBtn} from '@/shared/IconBtn'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {Txt} from '@/shared/Txt'
import {Obj, seq} from '@axanc/ts-utils'
import {useMemo} from 'react'
import {AddUserForm} from './AddUserForm'
import {useQueryUser} from '@/core/query/useQueryUser'
import {useSession} from '@/core/Session/SessionContext'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {settingsRoute} from '@/features/Settings/Settings'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Ip} from 'infoportal-api-sdk'
import {useWorkspaceContext} from '@/features/Workspace/Workspace'

export const settingsUsersRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'users',
  component: SettingsUsers,
})

function SettingsUsers() {
  const {m, formatDate, formatDateTime} = useI18n()
  const {permission} = useWorkspaceContext()
  const {conf} = useAppSettings()
  const {workspaceId} = settingsUsersRoute.useParams()
  const navigate = useNavigate()
  const ctxSession = useSession()
  const queryUserGet = useQueryUser.getAll(workspaceId)
  const queryUserCreate = useQueryUser.create(workspaceId)

  const connectAs = async (email: string) => {
    await ctxSession.connectAs.mutateAsync(email)
    await navigate({to: '/'})
  }

  const emailsLists = useMemo(() => queryUserGet.data?.map(_ => _.email), [queryUserGet.data])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          loading={queryUserGet.isLoading}
          id="users"
          showExportBtn
          defaultLimit={100}
          data={queryUserGet.data}
          header={
            permission.user_canCreate && (
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
                <IpBtn icon="person_add" variant="outlined">
                  {m.addUser}
                </IpBtn>
              </Modal>
            )
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
              id: 'job',
              head: m.job,
              renderQuick: _ => _.drcJob,
              type: 'select_one',
              options: () =>
                seq(queryUserGet.data?.map(_ => _.drcJob))
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
                label: (
                  <IpSelectSingle
                    disabled={!permission.user_canUpdate}
                    onChange={console.log}
                    value={_.accessLevel}
                    options={Obj.keys(Ip.AccessLevel)}
                  />
                ),
                value: _.accessLevel,
              }),
              options: () => Obj.keys(Ip.AccessLevel).map(_ => ({value: _, label: _})),
            },
            {
              id: 'action',
              width: 10,
              align: 'right',
              renderQuick: _ =>
                permission.use_canConnectAs && (
                  <IpIconBtn
                    disabled={_.email === conf.contact || _.email === ctxSession.user.email}
                    children="visibility"
                    loading={ctxSession.connectAs.isPending}
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
