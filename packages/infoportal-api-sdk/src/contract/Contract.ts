import {formVersionContract} from './form/version/ContractFormVersion'
import {initContract} from '@ts-rest/core'

export const ipContract = initContract().router({
  form: {
    version: formVersionContract,
  },
})
