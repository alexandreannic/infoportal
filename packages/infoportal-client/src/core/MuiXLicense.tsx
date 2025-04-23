'use client'

import {LicenseInfo} from '@mui/x-license-pro'
import {appConfig} from '@/conf/AppConfig'

LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

export default function MuiXLicense() {
  return null
}
