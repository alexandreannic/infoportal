import {formVersionContract} from './form/ContractFormVersion'
import {initContract} from '@ts-rest/core'
import {formContract} from './form/ContractForm'
import {serverContract} from './ContractServer'
import {koboContract} from './kobo/ContractKobo'
import {formAccessContract} from './form/ContractFormAccess'
import {permissionContract} from './ContractPermission'

export const ipContract = initContract().router({
  permission: permissionContract,
  server: serverContract,
  kobo: koboContract,
  form: {
    ...formContract,
    access: formAccessContract,
    version: formVersionContract,
  },
})
