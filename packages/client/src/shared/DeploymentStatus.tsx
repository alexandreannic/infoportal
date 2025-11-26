import {Icon as MuiIcon, IconProps, Theme, useTheme} from '@mui/material'
import {Api} from '@infoportal/api-sdk'
import {useI18n} from '@infoportal/client-i18n'

export const deploymentStatusIcon = {
  [Api.Form.DeploymentStatus.deployed]: 'public',
  [Api.Form.DeploymentStatus.archived]: 'archive',
  [Api.Form.DeploymentStatus.draft]: 'stylus_note',
}

export const deploymentStatusColor = (t: Theme) => ({
  [Api.Form.DeploymentStatus.deployed]: t.palette.success.main,
  [Api.Form.DeploymentStatus.archived]: t.palette.text.disabled,
  [Api.Form.DeploymentStatus.draft]: t.palette.text.disabled,
})

export const DeploymentStatusIcon = ({
  status,
  fontSize = 'small',
  sx,
  ...props
}: IconProps & {status: Api.Form.DeploymentStatus}) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <MuiIcon
      title={m.deploymentStatus_[status]}
      fontSize={fontSize}
      sx={{color: deploymentStatusColor(t)[status], ...sx}}
      {...props}
    >
      {deploymentStatusIcon[status]}
    </MuiIcon>
  )
}
