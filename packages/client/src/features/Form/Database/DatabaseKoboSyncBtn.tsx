import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'

export const DatabaseKoboSyncBtn = (props: Core.BtnProps) => {
  const {m} = useI18n()
  return (
    <Core.Btn variant="light" icon="cloud_sync" tooltip={props.tooltip ?? m._koboDatabase.pullData} {...props}>
      {m.sync}
    </Core.Btn>
  )
}
