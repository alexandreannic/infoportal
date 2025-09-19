import {m} from '@/i18n'
import style from './Overview.module.css'
import {Obj} from '@axanc/ts-utils'
import {OverviewCard} from '@/shared/Overview/OverviewCard'
import {SectionTitle} from '@/shared/SectionTitle/SectionTitle'

export const Overview = () => {
  return (
    <section className={style.root}>
      <SectionTitle children={m.overviewTitle} />
      {Obj.entries(m.overview_).map(([key, _], i) => (
        <OverviewCard key={key} title={_.title} desc={_.desc} imageSrc={'/ss-' + key + '.png'} mirror={i % 2 === 0} />
      ))}
    </section>
  )
}
