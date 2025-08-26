import {IpBtn, IpBtnProps} from '../../../../../infoportal-client-core/src/Btn.js'
import React from 'react'
import {useI18n} from '@/core/i18n'

export const DatabaseKoboSyncBtn = (props: IpBtnProps) => {
  const {m} = useI18n()
  return (
    <CoreBtn variant="light" icon="cloud_sync" tooltip={props.tooltip ?? m._koboDatabase.pullData} {...props}>
      {m.sync}
    </CoreBtn>
  )
}
