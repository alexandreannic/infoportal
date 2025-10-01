import {Ip} from 'infoportal-api-sdk'

export const mapDashboard = <T extends {id: string; sourceFormId: string; createdBy: string}>(
  _: T,
): T & {id: Ip.DashboardId; sourceFormId: Ip.FormId; createdBy: Ip.User.Email} => _ as any

export const mapWidget = <T extends {id: string; title: string | null; position: any; config: any}>(
  _: T,
): T & {id: Ip.Dashboard.WidgetId; position: Ip.Dashboard.Widget.Position; title?: string; config: any} => _ as any

export const mapSection = <
  T extends {id: string; dashboardId: string; title: string | null; description: string | null},
>(
  _: T,
): T & {id: Ip.Dashboard.SectionId; dashboardId: Ip.DashboardId; title: string; description?: string} => _ as any
