import {UseDashboardFilters, useDashboardFilters} from '@/features/Dashboard/Context/useDashboardFilters'
import {
  UseFlattenRepeatGroupData,
  useFlattenRepeatGroupData,
} from '@/features/Dashboard/Context/useGetDataByRepeatGroup'
import {seq} from '@axanc/ts-utils'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from '@infoportal/api-sdk'
import {SchemaInspector} from '@infoportal/form-helper'
import {Dispatch, ReactNode, SetStateAction, useMemo, useState} from 'react'
import {createContext, useContextSelector} from 'use-context-selector'
import {UseDashboardFilteredDataCache, useDashboardFilteredDataCache} from './useDashboardData'
import {UseDashboardFormEdit, useDashboardFormEdit} from './useDashboardFormEdit'
import {UseDashboardGridLayout, useDashboardGridLayout} from '@/features/Dashboard/Context/useDashboardGridLayout'

// TODO this type could be globalized. It's maybe defined somewhere already
export type Answers = Ip.Submission.Meta & Record<string, any>

export type DashboardContext = {
  flattenRepeatGroupData: UseFlattenRepeatGroupData
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  filter: UseDashboardFilters
  dataRange: Ip.Period
  effectiveDataRange: Ip.Period
  workspaceId: Ip.WorkspaceId
  data: UseDashboardFilteredDataCache
  dashboard: Ip.Dashboard
  schemaInspector: SchemaInspector<true>
  widgetsBySection: Map<Ip.Dashboard.SectionId, Ip.Dashboard.Widget[]>
  sections: Ip.Dashboard.Section[]
  updateForm: UseDashboardFormEdit
  gridLayout: UseDashboardGridLayout
}

const Context = createContext<DashboardContext>({} as DashboardContext)

export const useDashboardContext = <Selected extends any>(selector: (_: DashboardContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const DashboardProvider = ({
  children,
  workspaceId,
  dashboard,
  sections,
  schema,
  widgets,
  submissions,
}: {
  sections: Ip.Dashboard.Section[]
  workspaceId: Ip.WorkspaceId
  dashboard: Ip.Dashboard
  schema: Ip.Form.Schema
  widgets: Ip.Dashboard.Widget[]
  submissions: Ip.Submission[]
  children: ReactNode
}) => {
  const {m} = useI18n()
  const [langIndex, setLangIndex] = useState(0)

  const dataRange = useMemo(() => {
    if (submissions.length === 0) return {start: new Date(), end: new Date()}
    let start = submissions[0].submissionTime.getTime()
    let end = submissions[0].submissionTime.getTime()
    for (let i = 1; i < submissions.length - 1; i++) {
      const time = submissions[i].submissionTime.getTime()
      if (start > time) start = time
      else if (end < time) end = time
    }
    return {start: new Date(start), end: new Date(end)}
  }, [submissions])

  const effectiveDataRange = useMemo(() => {
    return {start: dashboard.start ?? dataRange.start, end: dashboard.end ?? dataRange.end}
  }, [dashboard.start, dashboard.end, dataRange])

  const dataSource = useMemo(() => {
    return seq(submissions).map(({answers, ...rest}) => ({...answers, ...rest}))
  }, [submissions])

  const schemaInspectorWithMeta = useMemo(() => {
    return new SchemaInspector(schema, langIndex).withMeta(m._meta, {validationStatus: m.validation_})
  }, [schema, langIndex])

  const filter = useDashboardFilters({defaultPeriod: effectiveDataRange})
  const data = useDashboardFilteredDataCache({
    data: dataSource,
    schemaInspector: schemaInspectorWithMeta,
    filters: filter.get,
    dashboard,
  })

  const widgetsBySection = useMemo(() => {
    return seq(widgets).groupByToMap(_ => _.sectionId as Ip.Dashboard.SectionId)
  }, [widgets])

  const flattenRepeatGroupData = useFlattenRepeatGroupData(schemaInspectorWithMeta)

  const updateForm = useDashboardFormEdit({workspaceId, dashboard})

  const gridLayout = useDashboardGridLayout(widgets, dashboard)
  return (
    <Context.Provider
      value={{
        gridLayout,
        updateForm,
        flattenRepeatGroupData,
        dataRange,
        filter,
        effectiveDataRange,
        workspaceId,
        widgetsBySection,
        schemaInspector: schemaInspectorWithMeta,
        data,
        dashboard,
        langIndex,
        sections,
        setLangIndex,
      }}
    >
      {children}
    </Context.Provider>
  )
}
