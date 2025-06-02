import React from 'react'
import {styleUtils} from '../../../core/theme'
import {IpBtn} from '../../Btn'

export const AppHeaderItem = ({children, href}: {children: any; href?: string}) => {
  return (
    <IpBtn
      color="primary"
      href={href}
      sx={{
        textTransform: 'initial',
        fontSize: t => styleUtils(t).fontSize.normal,
        py: 0,
        px: 2,
      }}
    >
      {children}
    </IpBtn>
  )
}
