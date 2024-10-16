import React, {useEffect} from 'react'
import {GlobalStyles, useTheme} from '@mui/material'
import {useAppSettings} from '@/core/context/ConfigContext'
import {defaultAppThemeParams} from '@/core/theme'
import {MetaSnapshot} from '@/app/meta/Snapshot/MetaSnapshot'

const generalStyles = <GlobalStyles styles={{
  body: {
    // background: '#fff',
  }
}}/>

const Meta = () => {
  const {theme} = useAppSettings()
  const t = useTheme()
  useEffect(() => {
    theme.setAppThemeParams({
      dark: false,
      mainColor: '#af161e',
      backgroundDefault: defaultAppThemeParams.light.backgroundPaper,
      backgroundPaper: defaultAppThemeParams.light.backgroundDefault,
      fontSize: 14,
      cardElevation: 0,
      spacing: 6,
    })
  }, [])
  return (
    <>
      {generalStyles}
      <MetaSnapshot/>
    </>
  )
}

export default Meta