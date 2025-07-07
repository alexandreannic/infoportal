import {formVersionContract} from './form/version/ContractFormVersion'
import {initContract} from '@ts-rest/core'
import {formContract} from './form/ContractForm'
import {serverContract} from './ContractServer'

export const ipContract = initContract().router({
  server: serverContract,
  form: {
    ...formContract,
    version: formVersionContract,
  },
})
