import {alpha, Box, Collapse, Radio} from '@mui/material'
import {DatabaseView, DatabaseViewVisibility} from '@/core/sdk/server/databaseView/DatabaseView'
import {useI18n} from '@/core/i18n'
import {IpIconBtn, Txt} from '@/shared'
import {IpListItem} from '@/shared/IpListItem'
import {ipSelectItem, IpSelectSingle} from '@/shared/Select/SelectSingle'
import {BtnConfirm} from '@/shared/BtnConfirm'
import React from 'react'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles<{open?: boolean}>()((t, {open}) => ({
  root: {
    marginBottm: open ? t.spacing(1) : 0,
    border: '2px solid transparent',
    borderColor: open ? t.palette.primary.main : undefined,
    // border: '2px solid + ' open ? alpha(t.palette.primary.main, .08) : undefined,
    padding: open ? t.spacing(1) : 0,
    transition: t.transitions.create('all'),
    borderRadius: t.shape.borderRadius + 'px',
    boxShadow: open ? t.shadows[1] : undefined,
    ':hover': {
      background: alpha(t.palette.primary.main, 0.08),
    },
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    borderBottom: open ? `1px solid ${t.palette.divider}` : undefined,
    marginBottom: open ? t.spacing(1) : 0,
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
          {view.name}&nbsp;<Txt color="hint">({view.visibility})</Txt>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center'}} onClick={(e) => e.stopPropagation()}>
          <IpIconBtn onClick={onOpen} color={open ? 'primary' : undefined}>
            {open ? 'close_fullscreen' : 'settings'}
          </IpIconBtn>
        </Box>
      </div>
      <Collapse in={open}>
        <IpListItem icon="notes">
          <Txt size="small">
            <Box>{view.details.length} items</Box>
            {!readOnly && <Box>{m.createdByAt(view.createdBy, formatDateTime(view.createdAt))}</Box>}
            {view.updatedBy && <Box>{m.updatedByAt(view.updatedBy, formatDateTime(view.updatedAt))}</Box>}
          </Txt>
        </IpListItem>
        <IpListItem icon="public">
          <Txt size="small" color="hint">
            {m.visibility}
          </Txt>
          <IpSelectSingle<DatabaseViewVisibility>
            disabled={readOnly}
            value={view.visibility}
            onChange={(_) => onUpdate({visibility: _})}
            renderValue={(_) => _}
            hideNullOption
            options={[
              ipSelectItem({
                value: DatabaseViewVisibility.Public,
                icon: 'public',
                title: m._datatable.viewPublic,
                desc: m._datatable.viewPublicDesc,
              }),
              ipSelectItem({
                value: DatabaseViewVisibility.Sealed,
                icon: 'lock',
                title: m._datatable.viewLock,
                desc: m._datatable.viewLockDesc,
              }),
              ipSelectItem({
                value: DatabaseViewVisibility.Private,
                icon: 'visibility_off',
                title: m._datatable.viewPrivate,
                desc: m._datatable.viewPrivateDesc,
              }),
            ]}
          />
        </IpListItem>
        {!readOnly && (
          <IpListItem icon="delete">
            <BtnConfirm size="small" iconAfter="chevron_right" onClick={onDelete}>
              {m.delete}
            </BtnConfirm>
          </IpListItem>
        )}
      </Collapse>
    </div>
  )
}
