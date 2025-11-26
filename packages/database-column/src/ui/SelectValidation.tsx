import React from 'react'
import {SelectSingleNullableProps, SelectStatus} from '@infoportal/client-core'
import {Api} from '@infoportal/api-sdk'

export const SelectValidation = (props: SelectSingleNullableProps<Api.Submission.Validation>) => {
  return (
    <SelectStatus iconFilled status={Api.Submission.Validation} labels={Api.Submission.validationToStatus} {...props} />
  )
}
