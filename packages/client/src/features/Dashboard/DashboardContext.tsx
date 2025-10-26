import React, {Dispatch, ReactNode, SetStateAction, useMemo, useState} from 'react'
import {Ip} from 'infoportal-api-sdk'
import {seq, Seq} from '@axanc/ts-utils'
import {KoboSchemaHelper, PeriodHelper} from 'infoportal-common'
import {useI18n} from '@infoportal/client-i18n'
import {subDays} from 'date-fns'
import {UseFlattenRepeatGroupData, useFlattenRepeatGroupData} from '@/features/Dashboard/useGetDataByRepeatGroup'
import {useContextSelector, createContext} from 'use-context-selector'

// TODO this type could be globalized. It's maybe defined somewhere already
export type Answers = Ip.Submission.Meta & Record<string, any>

type DashboardContext = {
  flattenRepeatGroupData: UseFlattenRepeatGroupData
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  dataRange: Ip.Period
  effectiveDataRange: Ip.Period
  workspaceId: Ip.WorkspaceId
  flatSubmissions: Seq<Answers>
  flatSubmissionsDelta?: Seq<Answers>
  dashboard: Ip.Dashboard
  schema: KoboSchemaHelper.Bundle<true>
  widgetsBySection: Map<Ip.Dashboard.SectionId, Ip.Dashboard.Widget[]>
}

type Filters = {
  period: Ip.Period
}

const Context = createContext<DashboardContext>({} as DashboardContext)

export const useDashboardContext = <Selected extends any>(selector: (_: DashboardContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const DashboardProvider = ({
  children,
  workspaceId,
  dashboard,
  schema,
  widgets,
  submissions,
}: {
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

  const [filters, setFilters] = useState<Filters>({
    period: {start: effectiveDataRange.start, end: effectiveDataRange.end},
  })

  const widgetsBySection = useMemo(() => {
    return seq(widgets).groupByToMap(_ => _.sectionId as Ip.Dashboard.SectionId)
  }, [widgets])

  const schemaWithMeta = useMemo(() => {
    const bundle = KoboSchemaHelper.buildBundle({schema, langIndex})
    return KoboSchemaHelper.withMeta(bundle, m._meta, {validationStatus: m.validation_})
  }, [schema, langIndex])

  const flatSubmissions = useMemo(() => {
    return seq(
      submissions
        .filter(_ => PeriodHelper.isDateIn(filters.period, _.submissionTime))
        .map(({answers, ...rest}) => ({...answers, ...rest})),
    )
  }, [submissions, filters])

  // TODO Cache
  const flatSubmissionsDelta = useMemo(() => {
    if (!dashboard.periodComparisonDelta) return
    return flatSubmissions.filter(_ =>
      PeriodHelper.isDateIn({end: subDays(effectiveDataRange.end, dashboard.periodComparisonDelta!)}, _.submissionTime),
    )
  }, [flatSubmissions, effectiveDataRange.end])

  const flattenRepeatGroupData = useFlattenRepeatGroupData(schemaWithMeta)

  return (
    <Context.Provider
      value={{
        flattenRepeatGroupData,
        filters,
        setFilters,
        dataRange,
        effectiveDataRange,
        workspaceId,
        widgetsBySection,
        schema: schemaWithMeta,
        flatSubmissions,
        flatSubmissionsDelta,
        dashboard,
        langIndex,
        setLangIndex,
      }}
    >
      {children}
    </Context.Provider>
  )
}
