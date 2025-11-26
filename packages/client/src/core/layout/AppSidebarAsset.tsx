import {Box, Icon, Tooltip as MuiTooltip, useTheme} from '@mui/material'
import {capitalize} from '@infoportal/common'
import {Link} from '@tanstack/react-router'
import {SidebarItem} from '@/shared/Layout/Sidebar/index.js'
import {Asset, AssetIcon} from '@/shared/Asset.js'
import {Core} from '@/shared'
import {ReactElement} from 'react'
import {Api} from '@infoportal/api-sdk'
import {SidebarItemProps} from '@/shared/Layout/Sidebar/SidebarItem.js'
import {DeploymentStatusIcon} from '@/shared/DeploymentStatus.js'

export const AppSidebarAsset = ({
  asset,
  workspaceId,
  formItemSize,
}: {
  workspaceId: Api.WorkspaceId
  formItemSize: SidebarItemProps['size']
  asset: Asset
}) => {
  const t = useTheme()
  return (
    <Tooltip asset={asset}>
      <Link to="/$workspaceId/form/$formId" params={{workspaceId, formId: asset.id}}>
        {({isActive}) => (
          <SidebarItem
            size={formItemSize}
            sx={{height: 26}}
            onClick={() => undefined}
            icon={<AssetIcon fontSize="small" sx={{mr: `calc(${t.vars.spacing}/ -2)`}} type={asset.type} />}
            key={asset.id}
            active={isActive}
            iconEnd={
              asset.deploymentStatus &&
              asset.deploymentStatus !== 'deployed' && (
                <DeploymentStatusIcon
                  fontSize="small"
                  status={asset.deploymentStatus}
                  sx={{marginLeft: '4px', marginRight: '-4px'}}
                />
              )
            }
          >
            <Core.Txt
              sx={{
                color:
                  asset.deploymentStatus === 'draft' || asset.deploymentStatus === 'archived'
                    ? t.vars.palette.text.disabled
                    : t.vars.palette.text.primary,
              }}
            >
              {asset.name}
              {/* {asset.custom && <span style={{fontWeight: 300}}> ({m._koboDatabase.mergedDb})</span>} */}
            </Core.Txt>
          </SidebarItem>
        )}
      </Link>
    </Tooltip>
  )
}

function Tooltip({asset, children}: {asset: Asset; children: ReactElement}) {
  return (
    <MuiTooltip
      key={asset.id}
      title={
        <Box>
          <Box display="flex" alignItems="center">
            {asset.category}
            {asset.category && (
              <Icon color="inherit" fontSize="small">
                chevron_right
              </Icon>
            )}
            <Core.Txt bold noWrap>
              {asset.name}
            </Core.Txt>
          </Box>
          {asset.deploymentStatus && asset.deploymentStatus !== 'deployed' && (
            <Box>
              <DeploymentStatusIcon
                status={asset.deploymentStatus}
                fontSize="medium"
                sx={{width: 35, m: 0}}
                color="inherit"
              />
              <Core.Txt bold>{capitalize(asset.deploymentStatus ?? '')}</Core.Txt>
            </Box>
          )}
        </Box>
      }
      placement="right-end"
      children={children}
    />
  )
}
