import React from 'react'
import {SelectSingleNullableProps, SelectStatus} from '@infoportal/client-core'
import {Ip} from 'infoportal-api-sdk'

export const SelectValidation = (props: SelectSingleNullableProps<Ip.Submission.Validation>) => {
  return (
    <SelectStatus iconFilled status={Ip.Submission.Validation} labels={Ip.Submission.validationToStatus} {...props} />
  )
}
