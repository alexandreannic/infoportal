import React, {ReactNode, useMemo} from 'react'
import {Ip} from 'infoportal-api-sdk'
import {seq, Seq} from '@axanc/ts-utils'
import {KoboSchemaHelper, PeriodHelper} from 'infoportal-common'
import {useI18n} from '@infoportal/client-i18n'
import {subDays} from 'date-fns'

type Context = {
  workspaceId: Ip.WorkspaceId
  flatSubmissions: Seq<Ip.Submission.Meta & Record<string, any>>
  flatSubmissionsDelta?: Seq<Ip.Submission.Meta & Record<string, any>>
  dashboard: Ip.Dashboard
  schema: KoboSchemaHelper.Bundle<true>
  widgetsBySection: Map<Ip.Dashboard.SectionId, Ip.Dashboard.Widget[]>
}

const DashboardContext = React.createContext<Context>({} as Context)
export const useDashboardContext = () => React.useContext(DashboardContext)

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
  schema: KoboSchemaHelper.Bundle
  widgets: Ip.Dashboard.Widget[]
  submissions: Ip.Submission[]
  children: ReactNode
}) => {
  const {m} = useI18n()
  const widgetsBySection = useMemo(() => {
    return seq(widgets).groupByToMap(_ => _.sectionId as Ip.Dashboard.SectionId)
  }, [widgets])

  const schemaWithMeta = useMemo(() => {
    return KoboSchemaHelper.upgradeIncludingMeta(schema, m._meta, {validationStatus: m.validation_})
  }, [schema])

  const flatSubmissions = useMemo(() => {
    return seq(submissions.map(({answers, ...rest}) => ({...answers, ...rest})))
  }, [submissions])

  const flatSubmissionsDelta = useMemo(() => {
    if (!dashboard.periodComparisonDelta) return
    return flatSubmissions.filter(_ =>
      PeriodHelper.isDateIn({end: subDays(new Date(), dashboard.periodComparisonDelta!)}, _.submissionTime),
    )
  }, [flatSubmissions])

  return (
    <DashboardContext
      value={{
        workspaceId,
        widgetsBySection,
        schema: schemaWithMeta,
        flatSubmissions,
        flatSubmissionsDelta,
        dashboard,
      }}
    >
      {children}
    </DashboardContext>
  )
}
