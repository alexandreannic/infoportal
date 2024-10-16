import React, {useEffect} from 'react'
import {SnapshotProtMonitoEcho} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {GlobalStyles, useTheme} from '@mui/material'
import {useAppSettings} from '@/core/context/ConfigContext'
import {defaultAppThemeParams} from '@/core/theme'

const generalStyles = <GlobalStyles styles={{
  body: {
    // background: '#fff',
  }
}}/>

const SnapshotProtectionMonitoringPage = () => {
  const {theme} = useAppSettings()
  const t = useTheme()
  useEffect(() => {
    theme.setAppThemeParams({
      dark: false,
      mainColor: '#af161e',
      backgroundDefault: defaultAppThemeParams.light.backgroundPaper,
      backgroundPaper: defaultAppThemeParams.light.backgroundDefault,
      fontSize: 14,
      cardElevation: 1,
    })
  }, [])
  return (
    <>
      {generalStyles}
      <SnapshotProtMonitoEcho/>
    </>
  )
}

export default SnapshotProtectionMonitoringPage