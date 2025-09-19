'use client'
import {m} from '@/i18n'
import {Obj} from '@axanc/ts-utils'
import {HighlightCard} from '@/shared/Highlights/HighlightCard'
import {Grid} from '@mui/material'
import style from './Highlights.module.css'
import Hub from '@mui/icons-material/HubTwoTone'
import ElectricBolt from '@mui/icons-material/ElectricBoltTwoTone'
import Group from '@mui/icons-material/GroupTwoTone'
import RocketLaunch from '@mui/icons-material/RocketLaunchTwoTone'
import {Animate, AnimateList} from '@infoportal/client-core'

// '#2196F3',
//   '#FF9800',
//   '#673AB7',
//   '#009688',
//   '#F44336',
//   '#00BCD4',
//   '#FFEE58',
//   '#9C27B0',
//   '#CDDC39',
//   '#E91E63',

const styles: Record<keyof (typeof m)['highlights'], {icon: any; color: string}> = {
  centralized: {
    icon: Hub,
    color: '#2196F3',
  },
  interface: {
    icon: ElectricBolt,
    color: '#FF9800',
  },
  organization: {
    icon: Group,
    color: '#009688',
  },
  moreToCome: {
    icon: RocketLaunch,
    color: '#9C27B0',
  },
}
export const Highlights = () => {
  return (
    <section className={style.root}>
      <Grid container spacing={1}>
        {Obj.entries(m.highlights).map(([key, value], i) => (
          <Animate key={key} delay={i * 110}>
            <Grid key={key} size={{xs: 6, lg: 3}}>
              <HighlightCard {...value} {...styles[key]} />
            </Grid>
          </Animate>
        ))}
      </Grid>
    </section>
  )
}
