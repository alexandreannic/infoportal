import {fnSwitch} from '@axanc/ts-utils'
import React from 'react'
import {IconProps} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {Api} from '@infoportal/api-sdk'
import {questionTypeMuiIcon} from '@infoportal/form-helper'

export const KoboTypeIcon = ({
  children,
  ...props
}: {
  children?: Api.Form.QuestionType
} & Pick<IconProps, 'sx' | 'color'>) => {
  if (!children) return undefined
  return (
    <Datatable.HeadIcon
      children={fnSwitch(children, questionTypeMuiIcon, () => 'short_text')}
      tooltip={children}
      {...props}
    />
  )
}
