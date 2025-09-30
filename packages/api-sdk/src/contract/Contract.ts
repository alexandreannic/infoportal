import {formVersionContract} from './form/ContractFormVersion.js'
import {initContract} from '@ts-rest/core'
import {formContract} from './form/ContractForm.js'
import {serverContract} from './ContractServer.js'
import {koboContract} from './kobo/ContractKobo.js'
import {formAccessContract} from './form/ContractFormAccess.js'
import {permissionContract} from './ContractPermission.js'
import {workspaceContract} from './workspace/ContractWorkspace.js'
import {workspaceAccessContract} from './workspace/ContractWorkspaceAccess.js'
import {contractFormSubmission} from './form/ContractFormSubmission.js'
import {workspaceInvitationContract} from './workspace/ContractWorkspaceInvitation.js'
import {metricsContract} from './ContractMetrics.js'
import {userContract} from './ContractUser.js'
import {groupContract} from './ContractGroup.js'
import {formActionContract} from './form/action/ContractFormAction.js'
import {formActionLogContract} from './form/action/ContractFormActionLog.js'
import {formActionReportContract} from './form/action/ContractFormActionReport.js'
import {dashboardContract} from './dashboard/ContractDashboard.js'
import {widgetContract} from './dashboard/ContractWidget.js'
import {sectionContract} from './dashboard/ContractSection.js'

export const ipContract = initContract().router({
  permission: permissionContract,
  server: serverContract,
  kobo: koboContract,
  group: groupContract,
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
  submission: contractFormSubmission,
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
