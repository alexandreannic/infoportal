import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@infoportal/client-i18n'
import {Box, useTheme} from '@mui/material'
import {Core} from '@/shared'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Link} from '@tanstack/react-router'

export const DashboardCard = ({
  img,
  workspace,
  dashboard,
}: {
  img: string
  workspace: Ip.Workspace
  dashboard: Ip.Dashboard
}) => {
  const {conf} = useAppSettings()
  const {m, formatDate} = useI18n()
  const t = useTheme()
  const url = new URL(Ip.Dashboard.buildPath(workspace, dashboard), conf.baseURL).toString()
  const {toastSuccess} = useIpToast()

  return (
    <Core.Panel
      sx={{
        mb: 0,
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Core.PanelBody
        sx={{
          flex: 1,
          pb: 0.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            m: -1,
            mb: 0,
            backgroundColor: t.vars.palette.divider,
            borderRadius: t.vars.shape.borderRadius,
            flex: 1,
            backgroundImage: `url(${img})`,
            backgroundSize: `cover`,
          }}
        ></Box>
        <Core.Txt size="big" bold block sx={{mt: 0.5}}>
          {dashboard.name}
        </Core.Txt>

        {/*<Core.Txt color="hint" textAlign="right" block sx={{mt: 'auto'}}>*/}
        {/*  {formatDate(dashboard.createdAt)}*/}
        {/*</Core.Txt>*/}
      </Core.PanelBody>
      <Core.PanelFoot>
        <Link
          to="/$workspaceId/dashboard/$dashboardId/edit"
          params={{workspaceId: workspace.id, dashboardId: dashboard.id}}
        >
          <Core.Btn icon="edit">{m.edit}</Core.Btn>
        </Link>
        <Core.PopoverWrapper
          content={close => (
            <Box sx={{p: 2, maxWidth: 340}}>
              <Core.Txt size="big" block bold sx={{mb: 1}}>
                {m.copyLink}
              </Core.Txt>
              <Core.Input
                readOnly
                value={url}
                sx={{mb: 0.5}}
                helperText={null}
                endAdornment={
                  <Core.IconBtn
                    children="content_copy"
                    onClick={() => {
                      navigator.clipboard.writeText(url)
                      toastSuccess(m.copiedToClipboard)
                    }}
                  />
                }
              ></Core.Input>
              <a href={url} target="_blank">
                <Core.Txt noWrap link block>
                  {url}
                </Core.Txt>
              </a>
              <Core.Btn sx={{mt: 1}} onClick={close}>
                {m.close}
              </Core.Btn>
            </Box>
          )}
        >
          <Core.Btn icon="link">{m.copyLink}</Core.Btn>
        </Core.PopoverWrapper>
      </Core.PanelFoot>
    </Core.Panel>
  )
}
