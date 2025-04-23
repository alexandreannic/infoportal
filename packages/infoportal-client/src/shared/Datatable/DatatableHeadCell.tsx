import {makeStyles} from 'tss-react/mui'
import {IpBtn, IpIconBtnProps} from '@/shared'
import {ReactNode} from 'react'
import {Icon, Tooltip} from '@mui/material'

const useStyles = makeStyles()((t) => ({
  root: {
    width: '100%',
  },
  btn: {
    minWidth: 30,
  },
}))

export const DatabaseHeadCell = ({children, onClick}: {onClick: IpIconBtnProps['onClick']; children: ReactNode}) => {
  const {classes} = useStyles()
  return (
    <Tooltip
      placement="top"
      title={
        <div style={{display: 'flex', alignItems: 'center'}}>
          <IpBtn className={classes.btn} size="small" variant="contained" color="primary" onClick={onClick}>
            <Icon fontSize="small">visibility_off</Icon>
          </IpBtn>
          &nbsp;
          {children}
        </div>
      }
    >
      <div className={classes.root}>{children}</div>
    </Tooltip>
  )
}
