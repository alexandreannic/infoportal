import {makeStyles} from 'tss-react/mui'
import {ReactNode} from 'react'
import {Icon, Tooltip} from '@mui/material'
import {Core} from '@/shared'

const useStyles = makeStyles()(t => ({
  root: {
    width: '100%',
  },
  btn: {
    minWidth: 30,
  },
}))

export const DatabaseHeadCell = ({children, onClick}: {onClick: Core.IconBtnProps['onClick']; children: ReactNode}) => {
  const {classes} = useStyles()
  return (
    <Tooltip
      placement="top"
      title={
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Core.Btn className={classes.btn} size="small" variant="contained" color="primary" onClick={onClick}>
            <Icon fontSize="small">visibility_off</Icon>
          </Core.Btn>
          &nbsp;
          {children}
        </div>
      }
    >
      <div className={classes.root}>{children}</div>
    </Tooltip>
  )
}
