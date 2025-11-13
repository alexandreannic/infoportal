import {Icon as MuiIcon, IconProps} from '@mui/material'
import {Ip} from '@infoportal/api-sdk'
import {useI18n} from '@infoportal/client-i18n'

export type Asset = {
  id: string
  name: string
  category?: string
  createdAt: Date
  deploymentStatus?: Ip.Form.DeploymentStatus
  type: AssetType
}

export enum AssetType {
  internal = 'internal',
  smart = 'smart',
  kobo = 'kobo',
}

export const assetStyle = {
  icon: {
    [AssetType.internal]: 'content_paste',
    [AssetType.kobo]: 'cloud_download',
    [AssetType.smart]: 'dynamic_form',
  },
  color: {
    [AssetType.internal]: '#FF9800',
    [AssetType.kobo]: '#2196F3',
    [AssetType.smart]: '#9C27B0',
  },
}

export const AssetIcon = ({type, sx, ...props}: IconProps & {type: AssetType}) => {
  const {m} = useI18n()
  return (
    <MuiIcon title={m.formSource_[type]} sx={{color: assetStyle.color[type], ...sx}} {...props}>
      {assetStyle.icon[type]}
    </MuiIcon>
  )
}
