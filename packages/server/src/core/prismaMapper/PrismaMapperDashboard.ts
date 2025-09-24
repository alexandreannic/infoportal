import {Ip} from 'infoportal-api-sdk'

export const mapDashboard = <T extends {id: string; sourceFormId: string; createdBy: string}>(
  _: T,
): T & {id: Ip.DashboardId; sourceFormId: Ip.FormId; createdBy: Ip.User.Email} => _ as any

export const mapWidget = <T extends {id: string; position: any; config: any}>(
  _: T,
): T & {id: Ip.Dashboard.WidgetId; position: Ip.Dashboard.Widget.Position; config: any} => _ as any
