import style from './HighlightCard.module.css'
import {Box} from '@mui/material'

export const HighlightCard = ({
  color,
  icon: Icon,
  title,
  desc,
}: {
  icon: any
  title: string
  desc: string
  color: string
}) => {
  return (
    <div className={style.root}>
      <Icon className={style.icon} sx={{color}} />
      <Box sx={{color}} className={style.title} dangerouslySetInnerHTML={{__html: title}} />
      <div className={style.desc} dangerouslySetInnerHTML={{__html: desc}} />
    </div>
  )
}
