import {Box, Icon, SxProps, Theme, useTheme} from '@mui/material'
import React, {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {useForm} from 'react-hook-form'
import {DatabaseViewVisibility} from '@/core/sdk/server/databaseView/DatabaseView'
import {PanelTitle} from '../../../../../../infoportal-client-core/src/Panel'
import {DatabaseViewInputRow} from '@/features/Form/Database/view/DatabaseViewInputRow'
import {DatabaseViewDefaultName, UseDatabaseView} from '@/features/Form/Database/view/useDatabaseView'
import {useSession} from '@/core/Session/SessionContext'
import {useFormContext} from '@/features/Form/Form'
import {IpBtn, BtnProps} from '../../../../../../infoportal-client-core/src/Btn.js'

interface FormCreate {
  name: string
}

export const DatabaseViewEditor = ({sx, view: ctx}: {view: UseDatabaseView; sx?: SxProps<Theme>}) => {
  const {m} = useI18n()
  const {permission} = useFormContext()
  const [open, setOpen] = useState<string | undefined>(undefined)
  const session = useSession()

  const formCreate = useForm<FormCreate>()
  return (
    <Box sx={{p: 1}}>
      <Core.PanelTitle sx={{mb: 0.5}}>{m._datatable.view}</Core.PanelTitle>
      <Core.Alert color="info" icon={<Icon>help</Icon>} sx={{mb: 1}} deletable="permanent" id="db-view-info">
        <b>Views</b> save your column visibility and width. They can be shared with other users.
      </Core.Alert>
      {ctx.fetcherViews.get?.map(view => (
        <DatabaseViewInputRow
          key={view.id}
          readOnly={
            view.name === DatabaseViewDefaultName ||
            (view.visibility === DatabaseViewVisibility.Sealed &&
              view.createdBy !== session.user.email &&
              !permission.databaseview_manage)
          }
          open={open === view.id}
          onDelete={() => ctx.asyncViewDelete.call(view.id)}
          onOpen={() => setOpen(open === view.id ? undefined : view.id)}
          onUpdate={_ => ctx.currentView && ctx.asyncViewUpdate.call(ctx.currentView, _)}
          checked={ctx.currentView?.id === view.id}
          view={view}
          onClick={() => ctx.setCurrentViewId(view.id)}
        />
      ))}
      <Box>
        <Core.Input
          sx={{mt: 1, mb: -1}}
          {...formCreate.register('name', {required: true})}
          label={m._datatable.createNewView}
          endAdornment={
            <Core.Btn
              size="small"
              variant="text"
              loading={ctx.asyncViewCreate.loading}
              color="primary"
              disabled={!formCreate.formState.isValid}
              icon="add"
              children={m.create}
              onClick={formCreate.handleSubmit(_ => {
                ctx.asyncViewCreate
                  .call({
                    name: _.name,
                    visibility: DatabaseViewVisibility.Private,
                  })
                  .then(() => formCreate.reset({name: ''}))
              })}
            />
          }
        />
      </Box>
    </Box>
  )
}

export const DatabaseViewBtn = ({view, sx, ...props}: Core.BtnProps & {view: UseDatabaseView}) => {
  const t = useTheme()

  return (
    <Core.Btn
      icon="visibility"
      color="inherit"
      variant="input"
      endIcon={<Icon sx={{color: t.vars.palette.text.secondary}}>arrow_drop_down</Icon>}
      children={view.currentView?.name ?? '-'}
      sx={{
        // fontWeight: 400,
        ...sx,
      }}
      {...props}
    />
  )
}
