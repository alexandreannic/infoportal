import React from 'react'
import {Ip} from 'infoportal-api-sdk'
import {Seq} from '@axanc/ts-utils'
import {KoboSchemaHelper} from 'infoportal-common'

type Context = {
  workspaceId: Ip.WorkspaceId
  flatSubmissions: Seq<Ip.Submission.Meta & Record<string, any>>
  dashboard: Ip.Dashboard
  schema: KoboSchemaHelper.Bundle<true>
  widgetsBySection: Map<Ip.Dashboard.SectionId, Ip.Dashboard.Widget[]>
}

export const DashboardContext = React.createContext<Context>({} as Context)
export const useDashboardContext = () => React.useContext(DashboardContext)
