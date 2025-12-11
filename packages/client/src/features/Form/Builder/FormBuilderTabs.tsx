import {Box, Icon, SxProps, Tab, Theme, useTheme} from '@mui/material'
import {useRouter} from '@tanstack/react-router'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {PopoverShareLink} from '@/shared/PopoverShareLink'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {TabLink, TabsLayout} from '@/shared/Tab/Tabs'
import {formBuilderXlsUploaderRoute} from '@/features/Form/Builder/Upload/XlsFileUploadForm'
import {formBuilderVersionRoute} from '@/features/Form/Builder/Version/FormBuilderVersion'
import {formBuilderEditorRoute} from '@/features/Form/Builder/Editor/FormBuilderEditor'
import {useFormContext} from '@/features/Form/Form'
import {useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'

export const FormBuilderTabs = ({sx}: {sx?: SxProps<Theme>}) => {
  const formId = useFormContext(_ => _.formId)
  const workspaceId = useFormContext(_ => _.workspaceId)
  const setShowPreview = useFormBuilderContext(_ => _.setShowPreview)
  const showPreview = useFormBuilderContext(_ => _.showPreview)
  const versions = useFormBuilderContext(_ => _.versions)

  const {m} = useI18n()
  const t = useTheme()
  const router = useRouter()
  const queryPermission = UseQueryPermission.form({workspaceId, formId})

  const location = router.buildLocation({
    to: '/collect/$workspaceId/$formId',
    params: {workspaceId, formId},
  })
  const absoluteUrl = window.location.origin + location.href

  return (
    <TabsLayout sx={sx}>
      <TabLink sx={{flex: 1}} icon={<Icon>commit</Icon>} to={formBuilderVersionRoute.fullPath} label={m.versions} />
      <TabLink
        to={formBuilderXlsUploaderRoute.fullPath}
        sx={{flex: 1}}
        icon={<Icon>upload</Icon>}
        label={m.upload}
        disabled={!queryPermission.data?.version_canCreate}
      />
      <TabLink sx={{flex: 1}} icon={<Icon>edit</Icon>} label={m.editor} to={formBuilderEditorRoute.fullPath} />
      <Box
        sx={{
          height: `calc(100% - ${t.vars.spacing})`,
          my: 0.5,
          mx: 1,
          borderRight: '1px solid ' + t.vars.palette.divider,
        }}
      />
      <Tab
        sx={{flex: 1, whiteSpace: 'nowrap'}}
        iconPosition="start"
        icon={<Icon>visibility</Icon>}
        label={m._builder.previewLast}
        color={showPreview ? 'primary' : 'inherit'}
        disabled={!versions.last}
        onClick={() => setShowPreview(_ => !_)}
      />
      {/*<Link to="/collect/$workspaceId/$formId" params={{workspaceId, formId}} target="_blank">*/}
      {/*  <Tab sx={{flex: 1}} icon={<Icon>open_in_new</Icon>} label={m.open} disabled={!activeVersion} />*/}
      {/*</Link>*/}
      <PopoverShareLink label={m.copyResponderLink} url={absoluteUrl}>
        <Tab
          sx={{flex: 1}}
          iconPosition="start"
          icon={<Icon>share</Icon>}
          label={m.share}
          disabled={!versions.active}
        />
      </PopoverShareLink>
    </TabsLayout>
  )
}
