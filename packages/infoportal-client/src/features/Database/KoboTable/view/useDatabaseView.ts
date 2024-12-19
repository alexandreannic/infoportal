import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {useCallback, useEffect, useMemo} from 'react'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync} from '@/shared/hook/useAsync'
import {Seq, seq} from '@alexandreannic/ts-utils'
import {DatabaseView, DatabaseViewCol, DatabaseViewColVisibility, DatabaseViewVisibility} from '@/core/sdk/server/databaseView/DatabaseView'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {useSession} from '@/core/Session/SessionContext'

export type UseDatabaseView = ReturnType<typeof useDatabaseView>

export const DatabaseViewDefaultName = 'Default'

export const useDatabaseView = (formId: Kobo.FormId) => {
  const {api} = useAppSettings()
  const {session} = useSession()
  const [currentViewId, setCurrentViewId] = usePersistentState<string | undefined>(undefined, {storageKey: 'db-view' + formId})
  const fetcherViews = useFetcher(() => api.databaseView.search({databaseId: formId}))

  useEffect(function initView() {
    if (!fetcherViews.get) return
    if (fetcherViews.get.length === 0) {
      asyncViewCreate.call({name: DatabaseViewDefaultName, visibility: DatabaseViewVisibility.Public})
    } else if (!currentViewId) {
      setCurrentViewId(fetcherViews.get[0].id)
    }
  }, [fetcherViews.get])

  const asyncViewDelete = useAsync((id: UUID) => api.databaseView.delete(id).then(_ => {
    fetcherViews.set(_ => _?.filter(_ => _.id !== id))
  }))

  const currentView = useMemo(() => {
    if (!fetcherViews.get) return
    const match = fetcherViews.get.find(_ => _.id === currentViewId)
    return match ?? fetcherViews.get[0]
  }, [currentViewId, fetcherViews.get])

  const canUpdateView = (v: DatabaseView) => !!v && (v.visibility !== DatabaseViewVisibility.Sealed || v.createdBy === session.email)

  const asyncViewUpdate = useAsync(async (view: DatabaseView, changes: Partial<Pick<DatabaseView, 'visibility'>>) => {
    if (!canUpdateView(view)) return
    api.databaseView.update({id: view.id, ...changes})
    fetcherViews.set(_ => _?.map(_ => _.id === view.id ? {..._, ...changes} : _))
  })

  const asyncColUpdate = async (view: DatabaseView, body: {name: string, visibility?: DatabaseViewColVisibility, width?: number}) => {
    if (!canUpdateView(view)) return
    api.databaseView.updateCol(view.id, body)
    fetcherViews.set(views => {
      return views?.map(v => {
        if (v.id !== view.id) return v
        if (v.details.some(_ => _.name === body.name))
          return {
            ...v,
            details: v.details.map(col => col.name === body.name ? ({...col, ...body}) : col)
          }
        return {
          ...v,
          details: [...v.details, body]
        }
      })
    })
  }

  const asyncViewCreate = useAsync(async (params: Pick<DatabaseView, 'name' | 'visibility'>) => {
    const res = await api.databaseView.create({...params, databaseId: formId})
    fetcherViews.set(_ => [..._ ?? [], res])
  })

  const hiddenColumns = useMemo(() => {
    return currentView?.details?.filter(_ => _.visibility === DatabaseViewColVisibility.Hidden)?.map(_ => _.name) ?? []
  }, [currentView])

  const colsById = useMemo(() => {
    return seq(currentView?.details ?? []).groupByFirst(_ => _.name)
  }, [currentView])

  const onResizeColumn = useCallback((columnId: string, width: number) => {
    if (!currentView) return
    asyncColUpdate(currentView, {name: columnId, width})
  }, [currentView])

  const setHiddenColumns = useCallback((columns: string[]) => {
    if (!currentView) return
    const hidden = new Set(columns)
    const touchedColumns: Seq<Pick<DatabaseViewCol, 'name' | 'visibility'>> = seq([
      ...currentView?.details ?? [],
      ...seq(columns).filter(_ => !(currentView?.details.map(_ => _.name) ?? []).includes(_)).map(_ => ({name: _, visibility: DatabaseViewColVisibility.Visible}))
    ])
    const columnUpdates = touchedColumns.map(_ => {
      if (_.visibility === DatabaseViewColVisibility.Hidden && !hidden.has(_.name)) return {name: _.name, visibility: DatabaseViewColVisibility.Visible}
      if (_.visibility === DatabaseViewColVisibility.Visible && hidden.has(_.name)) return {name: _.name, visibility: DatabaseViewColVisibility.Hidden}
      return
    }).compact()
    columnUpdates?.forEach(_ => asyncColUpdate(currentView, _))
  }, [currentView])

  useEffect(() => {
    fetcherViews.fetch()
  }, [formId])

  return {
    fetcherViews,
    asyncViewCreate,
    asyncViewDelete,
    asyncViewUpdate,
    hiddenColumns,
    setHiddenColumns,
    setCurrentViewId,
    onResizeColumn,
    currentView,
    colsById,
  }
}