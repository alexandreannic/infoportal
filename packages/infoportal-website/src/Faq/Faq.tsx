import {m} from '@/i18n'
import {FaqCard} from '@/Faq/FaqCard'
import style from './Faq.module.css'
import {SectionTitle} from '@/SectionTitle/SectionTitle'

export const Faq = () => {
  return (
    <section className={style.root}>
      <div className={style.content}>
        <SectionTitle title={m.faq} />
        <div>
          {m.faq_.map((_, i) => (
            <FaqCard key={i} {..._} />
          ))}
        </div>
      </div>
    </section>
  )
}
