import {Ip} from 'infoportal-api-sdk'

export const mapDashboard = <T extends {id: string; sourceFormId: string; createdBy: string}>(
  _: T,
): T & {id: Ip.DashboardId; sourceFormId: Ip.FormId; createdBy: Ip.User.Email} => _ as any
