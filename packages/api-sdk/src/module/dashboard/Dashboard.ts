import type * as Prisma from '@prisma/client'
import {Brand} from '../common/Common.js'
import {Form, FormId} from '../form/Form.js'
import {Workspace, WorkspaceId} from '../workspace/Workspace.js'
import {User} from '../user/User'

export type DashboardId = Brand<string, 'DashboardId'>
export type Dashboard = {
  id: DashboardId
  slug: string
  name: string
  createdAt: Date
  isPublished?: boolean
  createdBy: User.Email
  sourceFormId: FormId
  description?: string
  workspaceId: WorkspaceId
  deploymentStatus: Form.DeploymentStatus
  isPublic: boolean
  start?: Date
  end?: Date
  filters?: Dashboard.Widget.ConfigFilter
  enableChartDownload?: boolean
  enableChartFullSize?: boolean
  periodComparisonDelta?: number
  theme: Dashboard.Theme
}

export type DashboardWithSnapshot = Dashboard & {
  snapshot: DashboardSnapshot
}

export type DashboardSnapshot = (Dashboard.Section & {
  widgets: Dashboard.Widget[]
})[]

export namespace Dashboard {
  export const buildPath = (workspace: Pick<Workspace, 'slug'>, dashboard: Pick<Dashboard, 'slug'>) =>
    '/d/' + workspace.slug + '/' + dashboard.slug

  export const map = (_: any): Dashboard => {
    if (_.createdAt) _.createdAt = new Date(_.createdAt)
    if (_.start) _.start = new Date(_.start)
    if (_.end) _.end = new Date(_.end)
    return _
  }

  export type Theme = {
    colorPrimary?: string
    borderRadius?: number
    fontFamily?: string
    fontSize?: number
    spacing?: number
    bgColor?: string
    cardElevation?: number
    cardBorderSize?: number
    cardBorderColor?: string
    cardBgColor?: string
    cardBlur?: number
    cardOpacity?: number
  }

  export namespace Payload {
    export type Delete = {
      workspaceId: WorkspaceId
      id: Dashboard['id']
    }
    export type Publish = Delete
    export type Create = {
      workspaceId: WorkspaceId
      name: string
      slug: string
      sourceFormId: FormId
      isPublic: boolean
    }
    export type Update = {
      id: Dashboard['id']
      workspaceId: Dashboard['workspaceId']
      isPublic?: Dashboard['isPublic']
      deploymentStatus?: Dashboard['deploymentStatus']
      name?: Dashboard['name']
      description?: Dashboard['description'] | null
      start?: Dashboard['start'] | null
      theme?: Dashboard['theme'] | null
      end?: Dashboard['end'] | null
      filters?: Dashboard['filters'] | null
      enableChartDownload?: Dashboard['enableChartDownload'] | null
      enableChartFullSize?: Dashboard['enableChartFullSize'] | null
      periodComparisonDelta?: Dashboard['periodComparisonDelta'] | null
    }
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
    i18n_title?: string[]
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
      date?: [Date | undefined, Date | undefined]
    }

    export type NumberRange = {min: number; max: number}

    export type Config = {
      [Type.Alert]: {
        i18n_content?: string[]
        type?: 'error' | 'warning' | 'info' | 'success'
        canHide?: boolean
        iconName?: string
      }
      [Type.Card]: {
        filter?: ConfigFilter
        icon?: string
        operation?: 'sum' | 'avg' | 'min' | 'max' | 'count'
        questionName?: string
        iconName?: string
      }
      [Type.LineChart]: {
        lines?: {
          i18n_label?: string[]
          questionName: string
          color?: string
          filter?: ConfigFilter
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
        mapping?: Record<string, string>
      }
      [Type.Table]: {
        filter?: ConfigFilter
        column?: {
          questionName: string
          i18n_label?: string[]
          rangesIfTypeNumber?: NumberRange[]
        }
        row?: {
          i18n_label?: string[]
          questionName: string
          rangesIfTypeNumber?: NumberRange[]
        }
      }
      [Type.BarChart]: {
        questionName?: string
        selectedChoices?: string[]
        filter?: ConfigFilter
        base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices'
        labels?: Record<string, string>
        limit?: number
        mapping?: Record<string, string[]>
        hiddenChoices?: string[]
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
      Alert: 'Alert',
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
