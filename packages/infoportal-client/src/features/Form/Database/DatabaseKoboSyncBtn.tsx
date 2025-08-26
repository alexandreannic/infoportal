import {IpBtn, BtnProps} from '../../../../../infoportal-client-core/src/Btn.js'
import React from 'react'
import {useI18n} from '@/core/i18n'

export const DatabaseKoboSyncBtn = (props: Core.BtnProps) => {
  const {m} = useI18n()
  return (
    <Core.Btn variant="light" icon="cloud_sync" tooltip={props.tooltip ?? m._koboDatabase.pullData} {...props}>
      {m.sync}
    </Core.Btn>
  )
}
