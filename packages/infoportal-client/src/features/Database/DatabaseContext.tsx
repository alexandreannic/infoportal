import { useSession } from '@/core/Session/SessionContext'
import { useAppSettings } from '@/core/context/ConfigContext'
import { useWorkspaceRouter } from '@/core/context/WorkspaceContext'
import { ApiSdk } from '@/core/sdk/server/ApiSdk'
import { Access } from '@/core/sdk/server/access/Access'
import { KoboForm } from '@/core/sdk/server/kobo/KoboMapper'
import { useIpToast } from '@/core/useToast'
import { AppFeatureId } from '@/features/appFeatureId'
import { useFetcher, UseFetcher } from '@/shared/hook/useFetcher'
import { useEffectFn } from '@axanc/react-hooks'
import { seq } from '@axanc/ts-utils'
import { UUID } from 'infoportal-common'
import { Kobo } from 'kobo-sdk'
import React, { ReactNode, useContext, useEffect, useMemo } from 'react'

export interface DatabaseContext {
  _forms: UseFetcher<(_: string) => ReturnType<ApiSdk['kobo']['form']['getAll']>>
  isAdmin?: boolean
  getForm: (_: Kobo.FormId) => KoboForm | undefined
  formsAccessible?: KoboForm[]
  // servers: UseFetcher<ApiSdk['kobo']['server']['getAll']>
}

export const Context = React.createContext({} as DatabaseContext)

export const useDatabaseContext = () => useContext(Context)

export const DatabaseProvider = ({children}: {children: ReactNode}) => {
  const {workspaceId} = useWorkspaceRouter()
  const {session} = useSession()
  const {api} = useAppSettings()
  const _forms = useFetcher(
    (workspaceId: UUID) =>
      api.kobo.form.getAll({workspaceId}).then(_ => seq(_).sortByString(_ => _.name)) as Promise<KoboForm[]>,
  )
  const {toastHttpError} = useIpToast()

  const getForm = useMemo(() => {
    const index = seq(_forms.get).reduceObject<Record<Kobo.FormId, KoboForm>>(_ => [_.id, _])
    return (_: Kobo.FormId) => index[_]
  }, [_forms.get])

  useEffect(() => {
    if (workspaceId) _forms.fetch({}, workspaceId)
  }, [workspaceId])

  const koboAccesses = useMemo(() => {
    return session.accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).map(_ => _.params?.koboFormId)
  }, [session.accesses])

  const formsAccessible = useMemo(() => {
    return _forms.get?.filter(_ => session.user.admin || koboAccesses.includes(_.id))
  }, [koboAccesses, _forms.get])

  useEffectFn(_forms.error, toastHttpError)

  return (
    <Context.Provider
      value={{
        _forms,
        isAdmin: session.user.admin,
        formsAccessible,
        getForm,
      }}
    >
      {children}
    </Context.Provider>
  )
}
