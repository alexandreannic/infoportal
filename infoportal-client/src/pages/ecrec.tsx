import React from 'react'
import {SessionProvider} from '@/core/Session/SessionContext'
import {EcrecRoot} from '@/features/Ecrec/Ecrec'

const EcrecPage = () => {
  return (
    <SessionProvider>
      <EcrecRoot/>
    </SessionProvider>
  )
}

export default EcrecPage