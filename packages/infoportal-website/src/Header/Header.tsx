import Image from 'next/image'
import style from './Header.module.css'
import {Button} from '@mui/material'
import {m} from '@/i18n'

export const Header = () => {
  return (
    <header className={style.root}>
      <Image src="/ip-logo7.svg" alt="InfoPortal Logo" height={40} width={40} />
      <b className={style.title}>InfoPortal</b>
      <Button size="small" variant="contained" sx={{marginLeft: 'auto'}}>
        &nbsp;&nbsp;{m.cta}&nbsp;&nbsp;
      </Button>
    </header>
  )
}
