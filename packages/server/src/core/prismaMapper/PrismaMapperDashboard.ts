import {Api} from '@infoportal/api-sdk'
import {Defined} from 'yup'

export const mapDashboard = <
  T extends {
    id: string
    workspaceId: string
    start: Date | null
    end: Date | null
    filters: any | null
    enableChartFullSize: boolean | null
    enableChartDownload: boolean | null
    periodComparisonDelta: number | null
    sourceFormId: string
    description: string | null
    createdBy: string
    theme?: any | null
  },
>(
  _: T,
): Defined<
  T & {
    id: Api.DashboardId
    workspaceId: Api.WorkspaceId
    sourceFormId: Api.FormId
    description?: string
    createdBy: Api.User.Email
    start?: Date
    end?: Date
    theme: Api.Dashboard.Theme
    filters?: Api.Dashboard.Widget.ConfigFilter
    enableChartFullSize?: boolean
    enableChartDownload?: boolean
    periodComparisonDelta?: number
  }
> => _ as any

export const mapWidget = <T extends {id: string; i18n_title: string[] | null; position: any; config: any}>(
  _: T,
): T & {id: Api.Dashboard.WidgetId; position: Api.Dashboard.Widget.Position; i18n_title?: string[]; config: any} =>
  _ as any

export const mapSection = <
  T extends {id: string; dashboardId: string; title: string | null; description: string | null},
>(
  _: T,
): T & {id: Api.Dashboard.SectionId; dashboardId: Api.DashboardId; title: string; description?: string} => _ as any
