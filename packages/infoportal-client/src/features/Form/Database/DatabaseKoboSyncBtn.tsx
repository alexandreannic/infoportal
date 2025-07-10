import {IpBtn, IpBtnProps} from '@/shared/Btn'
import React from 'react'
import {useI18n} from '@/core/i18n'

export const DatabaseKoboSyncBtn = (props: IpBtnProps) => {
  const {m} = useI18n()
  return (
    <IpBtn variant="light" icon="cloud_sync" tooltip={props.tooltip ?? m._koboDatabase.pullData} {...props}>
      {m.sync}
    </IpBtn>
  )
}
