import {IconProps, Icon as MuiIcon} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n/index.js'

export type Asset = {
  id: string
  name: string
  category?: string
  createdAt: Date
  deploymentStatus?: Ip.Form.DeploymentStatus
  type: Asset.Type
}

export namespace Asset {
  export enum Type {
    internal = 'internal',
    smart = 'smart',
    kobo = 'kobo',
  }
  export const icon = {
    [Type.internal]: 'content_paste',
    [Type.kobo]: 'cloud_download',
    [Type.smart]: 'dynamic_form',
  }

  export const color = {
    [Type.internal]: '#FF9800',
    [Type.kobo]: '#2196F3',
    [Type.smart]: '#9C27B0',
  }

  export const Icon = ({type, sx, ...props}: IconProps & {type: Type}) => {
    const {m} = useI18n()
    return (
      <MuiIcon title={m.formSource_[type]} sx={{color: color[type], ...sx}} {...props}>
        {icon[type]}
      </MuiIcon>
    )
  }
}
