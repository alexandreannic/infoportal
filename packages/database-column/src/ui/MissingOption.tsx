import React from 'react'
import * as Datatable from '@infoportal/client-datatable'
import {useI18n} from '@infoportal/client-i18n'

export function MissingOption({value}: {value?: string}) {
  const {m} = useI18n()
  return (
    <span title={value}>
      <Datatable.Icon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error" />
      {value}
    </span>
  )
}
