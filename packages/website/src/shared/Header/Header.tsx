import Image from 'next/image'
import style from './Header.module.css'
import {Button} from '@mui/material'
import {m} from '@/i18n'
import {MenuItem} from '@/shared/Header/MenuItem'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className={style.root}>
      <Link href="/" className={style.rootLink}>
        <Image src="/ip-logo9.svg" alt="InfoPortal Logo" height={40} width={40} />
        <b className={style.title}>InfoPortal</b>
      </Link>
      <nav className={style.nav}>
        <MenuItem href="/blog">{m.blog}</MenuItem>
        <Button size="small" variant="contained">
          &nbsp;&nbsp;{m.cta}&nbsp;&nbsp;
        </Button>
      </nav>
    </header>
  )
}
