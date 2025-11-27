import {formVersionContract} from './module/form/FormVersionContract.js'
import {initContract} from '@ts-rest/core'
import {formContract} from './module/form/FormContract.js'
import {serverContract} from './module/kobo/KoboAccountContract.js'
import {koboContract} from './module/kobo/KoboContract.js'
import {formAccessContract} from './module/form/access/FormAccessContract.js'
import {permissionContract} from './module/permission/PermissionContract.js'
import {workspaceContract} from './module/workspace/WorkspaceContract.js'
import {workspaceAccessContract} from './module/workspace/WorkspaceAccessContract.js'
import {submissionContract} from './module/submission/SubmissionContract.js'
import {workspaceInvitationContract} from './module/workspace/WorkspaceInvitationContract.js'
import {metricsContract} from './module/metrics/MetricsContract.js'
import {userContract} from './module/user/UserContract.js'
import {groupContract} from './module/group/GroupContract.js'
import {formActionContract} from './module/form/action/FormActionContract.js'
import {formActionLogContract} from './module/form/action/FormActionLogContract.js'
import {formActionReportContract} from './module/form/action/FormActionReportContract.js'
import {dashboardContract} from './module/dashboard/DashboardContract.js'
import {widgetContract} from './module/dashboard/DashboardWidgetContract.js'
import {sectionContract} from './module/dashboard/DashboardSectionContract.js'
import {databaseViewContract} from './module/database-view/DatabaseViewContract.js'
import {submissionHistoryContract} from './module/submission/history/SubmissionHistoryContract.js'

export const apiContract = initContract().router({
  permission: permissionContract,
  server: serverContract,
  kobo: koboContract,
  group: groupContract,
  databaseView: databaseViewContract,
  dashboard: {
    ...dashboardContract,
    section: sectionContract,
    widget: widgetContract,
  },
  workspace: {
    ...workspaceContract,
    invitation: workspaceInvitationContract,
    access: workspaceAccessContract,
  },
  submission: {...submissionContract, history: submissionHistoryContract},
  form: {
    ...formContract,
    access: formAccessContract,
    version: formVersionContract,
    action: {
      ...formActionContract,
      log: formActionLogContract,
      report: formActionReportContract,
    },
  },
  user: userContract,
  metrics: metricsContract,
})
