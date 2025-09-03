import style from './Banner.module.css'
import {m} from '@/i18n'
import {Button} from '@mui/material'
import {AnimatedText} from '@/shared/AnimatedText'
import {Pulse} from '@/shared/Pulse'

export const Banner = () => {
  return (
    <section className={style.root}>
      <div className={style.imageContainer}>
        {/*<Image*/}
        {/*  src={'/ss1.png'}*/}
        {/*  alt=""*/}
        {/*  width={800}*/}
        {/*  height={600}*/}
        {/*  style={{width: '100%', height: 'auto'}}*/}
        {/*  className={style.image}*/}
        {/*/>*/}
        <div className={style.content}>
          <div>
            <AnimatedText text={m.title} className={style.title} />
            <div className={style.desc}>{m.desc}</div>
            <Pulse>
              <Button variant="contained" size="large">
                {m.cta}
              </Button>
            </Pulse>
          </div>
        </div>
      </div>
    </section>
  )
}
