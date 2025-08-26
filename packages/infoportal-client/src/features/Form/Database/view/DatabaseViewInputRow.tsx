import {Box, Collapse, Radio} from '@mui/material'
import {DatabaseView, DatabaseViewVisibility} from '@/core/sdk/server/databaseView/DatabaseView'
import {useI18n} from '@/core/i18n'
import {BtnConfirm} from '@/shared/BtnConfirm'
import React from 'react'
import {makeStyles} from 'tss-react/mui'
import {alphaVar} from '@/core/theme.js'
import {Core} from '@/shared'

const useStyles = makeStyles<{open?: boolean}>()((t, {open}) => ({
  root: {
    marginBottm: open ? t.vars.spacing : 0,
    border: '2px solid transparent',
    borderColor: open ? t.vars.palette.primary.main : undefined,
    // border: '2px solid + ' open ? alpha(t.vars.palette.primary.main, .08) : undefined,
    padding: open ? t.vars.spacing : 0,
    transition: t.transitions.create('all'),
    borderRadius: t.vars.shape.borderRadius,
    boxShadow: open ? t.vars.shadows[1] : undefined,
    ':hover': {
      background: alphaVar(t.vars.palette.primary.main, 0.08),
    },
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    borderBottom: open ? `1px solid ${t.vars.palette.divider}` : undefined,
    marginBottom: open ? t.vars.spacing : 0,
  },
}))

export const DatabaseViewInputRow = ({
  checked,
  onClick,
  onDelete,
  onUpdate,
  onOpen,
  readOnly,
  view,
  open,
}: {
  readOnly?: boolean
  open?: boolean
  view: DatabaseView
  checked?: boolean
  onUpdate: (_: Pick<DatabaseView, 'visibility'>) => void
  onOpen: () => void
  onDelete: () => void
  onClick: () => void
}) => {
  const {m} = useI18n()
  const {classes} = useStyles({open})
  const {formatDateTime} = useI18n()

  return (
    <div className={classes.root}>
      <div className={classes.head} onClick={onClick}>
        <Radio checked={checked} />
        <Box sx={{flex: 1, height: '32px', display: 'flex', alignItems: 'center'}}>
          {view.name}&nbsp;<Core.Txt color="hint">({view.visibility})</Core.Txt>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center'}} onClick={e => e.stopPropagation()}>
          <Core.IconBtn onClick={onOpen} color={open ? 'primary' : undefined}>
            {open ? 'close_fullscreen' : 'settings'}
          </Core.IconBtn>
        </Box>
      </div>
      <Collapse in={open}>
        <Core.ListItem icon="notes">
          <Core.Txt size="small">
            <Box>{view.details.length} items</Box>
            {!readOnly && <Box>{m.createdByAt(view.createdBy, formatDateTime(view.createdAt))}</Box>}
            {view.updatedBy && <Box>{m.updatedByAt(view.updatedBy, formatDateTime(view.updatedAt))}</Box>}
          </Core.Txt>
        </Core.ListItem>
        <Core.ListItem icon="public">
          <Core.Txt size="small" color="hint">
            {m.visibility}
          </Core.Txt>
          <Core.SelectSingle<DatabaseViewVisibility>
            disabled={readOnly}
            value={view.visibility}
            onChange={_ => onUpdate({visibility: _})}
            renderValue={_ => _}
            hideNullOption
            options={[
              Core.SelectItem({
                value: DatabaseViewVisibility.Public,
                icon: 'public',
                title: m._datatable.viewPublic,
                desc: m._datatable.viewPublicDesc,
              }),
              Core.SelectItem({
                value: DatabaseViewVisibility.Sealed,
                icon: 'lock',
                title: m._datatable.viewLock,
                desc: m._datatable.viewLockDesc,
              }),
              Core.SelectItem({
                value: DatabaseViewVisibility.Private,
                icon: 'visibility_off',
                title: m._datatable.viewPrivate,
                desc: m._datatable.viewPrivateDesc,
              }),
            ]}
          />
        </Core.ListItem>
        {!readOnly && (
          <Core.ListItem icon="delete">
            <BtnConfirm size="small" iconAfter="chevron_right" onClick={onDelete}>
              {m.delete}
            </BtnConfirm>
          </Core.ListItem>
        )}
      </Collapse>
    </div>
  )
}
