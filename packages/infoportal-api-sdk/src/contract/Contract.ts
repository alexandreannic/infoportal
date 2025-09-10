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
import {formActionContract} from './form/ContractFormAction.js'

export const ipContract = initContract().router({
  permission: permissionContract,
  server: serverContract,
  kobo: koboContract,
  group: groupContract,
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
    action: formActionContract,
  },
  user: userContract,
  metrics: metricsContract,
})
