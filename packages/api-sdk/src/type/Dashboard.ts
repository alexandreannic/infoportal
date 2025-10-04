import type * as Prisma from '@prisma/client'
import {Brand} from './Common.js'
import {Form, FormId} from './Form.js'
import {Workspace, WorkspaceId} from './Workspace.js'
import {User} from './User'
import Widget = Dashboard.Widget

export type DashboardId = Brand<string, 'DashboardId'>
export type Dashboard = {
  id: DashboardId
  slug: string
  name: string
  createdAt: Date
  createdBy: User.Email
  sourceFormId: FormId
  description?: string
  workspaceId: WorkspaceId
  deploymentStatus: Form.DeploymentStatus
  isPublic: boolean
  start?: Date
  end?: Date
  filters?: Widget.ConfigFilter
  enableChartDownload?: boolean
  periodComparisonDelta?: number
}

export namespace Dashboard {
  export const buildPath = (workspace: Workspace, dashboard: Pick<Dashboard, 'slug'>) =>
    '/' + workspace.slug + '/d/' + dashboard.slug

  export const map = (_: any): Dashboard => {
    if (_.createdAt) _.createdAt = new Date(_.createdAt)
    if (_.start) _.start = new Date(_.start)
    if (_.end) _.end = new Date(_.end)
    return _
  }
  export namespace Payload {
    export type Create = {
      workspaceId: WorkspaceId
      name: string
      slug: string
      sourceFormId: FormId
      isPublic: boolean
    }
    export type Update = Pick<Dashboard, 'id' | 'workspaceId'> &
      Partial<
        Pick<
          Dashboard,
          | 'name'
          // 'slug'|
          | 'description'
          | 'deploymentStatus'
          | 'isPublic'
          | 'start'
          | 'end'
          | 'filters'
          | 'enableChartDownload'
          | 'periodComparisonDelta'
        >
      >
  }

  export type SectionId = Brand<string, 'SectionId'>
  export type Section = {
    id: SectionId
    title: string
    description?: string
    createdAt: Date
    dashboardId: DashboardId
  }
  export namespace Section {
    export const map = (_: Partial<Record<keyof Section, any>>): Section => {
      return _ as Section
    }
    export namespace Payload {
      export type Search = {
        workspaceId: WorkspaceId
        dashboardId: DashboardId
      }
      export type Create = {
        workspaceId: WorkspaceId
        dashboardId: DashboardId
        title: string
        description?: string
      }
      export type Update = {
        workspaceId: WorkspaceId
        id: SectionId
        title?: string
        description?: string
      }
    }
  }

  export type WidgetId = Brand<string, 'WidgetId'>
  export type Widget = Omit<Prisma.DashboardWidget, 'title' | 'config' | 'id' | 'position'> & {
    title?: string
    config: any
    position: Widget.Position
    id: WidgetId
  }
  export namespace Widget {
    export const map = (_: Partial<Record<keyof Widget, any>>): Widget => {
      return _ as Widget
    }
    export type Position = {
      x: number
      y: number
      w: number
      h: number
    }

    export type ConfigFilter = {
      questionName?: string
      number?: {min?: number; max?: number}
      choices?: string[]
    }

    export type Config = {
      [Type.Card]: {
        icon?: string
        operation?: 'sum' | 'avg' | 'min' | 'max'
      }
      [Type.LineChart]: {
        lines?: {
          title?: string
          questionName: string
          color?: string
          filter: ConfigFilter
        }[]
        start?: Date
        end?: Date
      }
      [Type.GeoPoint]: {
        questionName?: string
        filter?: ConfigFilter
      }
      [Type.GeoChart]: {
        questionName?: string
        filter?: ConfigFilter
        countryIsoCode?: string
      }
      [Type.BarChart]: {
        questionName?: string
        selectedChoices?: string[]
        filter?: ConfigFilter
        base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices'
        labels?: Record<string, string>
        limit?: number
        showValue?: boolean
        showEvolution?: boolean
      }
      [Type.PieChart]: {
        questionName?: string
        showEvolution?: boolean
        showValue?: boolean
        showBase?: boolean
        filter?: ConfigFilter
        filterValue?: Omit<ConfigFilter, 'questionName'>
        filterBase?: Omit<ConfigFilter, 'questionName'>
        dense?: boolean
      }
    }

    export namespace Payload {
      export type Search = {
        workspaceId: WorkspaceId
        dashboardId?: DashboardId
        sectionId?: Dashboard.SectionId
      }

      export type Create = Omit<Widget, 'description' | 'id' | 'createdAt' | 'dashboardId'> & {
        description?: string
        workspaceId: WorkspaceId
        sectionId: SectionId
      }
      export type Update = Partial<Omit<Create, 'workspaceId' | 'id'>> & {
        id: WidgetId
        workspaceId: WorkspaceId
      }
    }
    export type Type = Prisma.WidgetType
    export const Type = {
      Card: 'Card',
      PieChart: 'PieChart',
      GeoChart: 'GeoChart',
      LineChart: 'LineChart',
      BarChart: 'BarChart',
      GeoPoint: 'GeoPoint',
      Table: 'Table',
    } as const
  }
}
