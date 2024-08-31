import {Badge, Box, Icon, SxProps, Theme, useTheme} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import {IpBtn} from '@/shared/Btn'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import React, {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {useForm} from 'react-hook-form'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {DatabaseViewVisibility} from '@/core/sdk/server/databaseView/DatabaseView'
import {PanelTitle} from '@/shared/Panel'
import {IpAlert} from '@/shared'
import {DatabaseViewDefaultName, DatabaseViewInputRow} from '@/features/Database/KoboTable/view/DatabaseViewInputRow'

interface FormCreate {
  name: string
}

export const DatabaseViewInput = ({sx}: {
  sx?: SxProps<Theme>,
}) => {
  const {m, formatDate} = useI18n()
  const t = useTheme()
  const ctx = useDatabaseKoboTableContext().view
  const [open, setOpen] = useState<string | undefined>(undefined)

  const formCreate = useForm<FormCreate>()
  return (
    <PopoverWrapper content={() => (
      <Box sx={{p: 1, minWidth: 200, width: 380}}>
        <PanelTitle sx={{mb: .5}}>{m._datatable.view}</PanelTitle>
        <IpAlert color="info" icon={<Icon>help</Icon>} sx={{mb: 1}} deletable="permanent" id="db-view-info">
          <b>Views</b> save your column visibility and column width settings and can be shared with other users
        </IpAlert>
        {ctx.fetcherViews.get?.map(view =>
          <DatabaseViewInputRow
            key={view.id}
            readOnly={view.name === DatabaseViewDefaultName}
            open={open === view.id}
            onDelete={() => ctx.asyncViewDelete.call(view.id)}
            onOpen={() => setOpen(open === view.id ? undefined : view.id)}
            onUpdate={(_) => ctx.asyncViewUpdate.call({id: view.id, ..._})}
            checked={ctx.currentView?.id === view.id}
            view={view}
            onClick={() => ctx.setCurrentViewId(view.id)}
          />
        )}
        <Box>
          <IpInput
            sx={{mt: 1, mb: -1}}
            {...formCreate.register('name', {required: true,})}
            label={m._datatable.createNewView}
            endAdornment={
              <IpBtn
                size="small"
                variant="text"
                loading={ctx.asyncViewCreate.loading}
                color="primary"
                disabled={!formCreate.formState.isValid}
                icon="add"
                children={m.create}
                onClick={formCreate.handleSubmit(_ => {
                  ctx.asyncViewCreate.call({
                    name: _.name,
                    visibility: DatabaseViewVisibility.Private,
                  }).then(() => formCreate.reset({name: ''}))
                })}
              />
            }
          />
        </Box>
      </Box>
    )}>
      <Badge color="info" badgeContent="NEW!">
        <IpBtn
          icon="visibility"
          color="primary"
          variant="light"
          endIcon={<Icon sx={{color: t.palette.text.secondary}}>arrow_drop_down</Icon>}
          children={ctx.currentView?.name ?? DatabaseViewDefaultName}
          sx={{
            // fontWeight: 400,
            ...sx,
          }}
        />
      </Badge>
    </PopoverWrapper>
  )
}