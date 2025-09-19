import {Icon as MuiIcon, IconProps, Theme, useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@infoportal/client-i18n'

export namespace DeploymentStatus {
  export const icon = {
    [Ip.Form.DeploymentStatus.deployed]: 'public',
    [Ip.Form.DeploymentStatus.archived]: 'archive',
    [Ip.Form.DeploymentStatus.draft]: 'stylus_note',
  }

  export const color = (t: Theme) => ({
    [Ip.Form.DeploymentStatus.deployed]: t.palette.success.main,
    [Ip.Form.DeploymentStatus.archived]: t.palette.text.disabled,
    [Ip.Form.DeploymentStatus.draft]: t.palette.text.disabled,
  })

  export const Icon = ({status, fontSize = 'small', sx, ...props}: IconProps & {status: Ip.Form.DeploymentStatus}) => {
    const t = useTheme()
    const {m} = useI18n()
    return (
      <MuiIcon title={m.deploymentStatus_[status]} fontSize={fontSize} sx={{color: color(t)[status], ...sx}} {...props}>
        {icon[status]}
      </MuiIcon>
    )
  }
}
