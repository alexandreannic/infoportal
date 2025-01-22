import {Ecrec} from '@/features/Ecrec/Ecrec'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'

const MpcaPage = () => {
  return (
    <ProtectRoute>
      <Ecrec />
    </ProtectRoute>
  )
}

export default MpcaPage
