import React from 'react'
import {GlobalStyles, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {SnapshotGbvMonito} from '@/features/Snapshot/SnapshotGbvSurvey/SnapshotGbvSurvey'

const generalStyles = <GlobalStyles styles={{
  body: {
    background: '#fff'
  }
}}/>

const SnapshotProtectionMonitoringPage = () => {
  return (
    <ThemeProvider theme={muiTheme({
      dark: false,
      fontSize: 13,
      mainColor: '#af161e',
      backgroundDefault: '#fff',
      backgroundPaper: '#f6f7f9',
      cardElevation: 1
    })}>
      {generalStyles}
      <SnapshotGbvMonito/>
    </ThemeProvider>
  )
}

export default SnapshotProtectionMonitoringPage