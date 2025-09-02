import {Header} from '@/Header/Header'
import {Banner} from '@/Banner/Banner'
import {Obj} from '@axanc/ts-utils'
import {OverviewCard} from '@/Overview/OverviewCard'
import {m} from '@/i18n'
import style from './page.module.css'
import {FaqCard} from '@/Faq/FaqCard'
import {Faq} from '@/Faq/Faq'
import {Highlights} from '@/Highlights/Highlights'
import {Overview} from '@/Overview/Overview'

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Banner />
        <Highlights />
        <Overview />
        <Faq />
      </main>
    </div>
  )
}
