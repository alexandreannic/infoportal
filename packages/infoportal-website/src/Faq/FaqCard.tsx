'use client'
import style from './FaqCard.module.css'
import {useState} from 'react'
import {Box, Collapse, IconButton} from '@mui/material'
import ChevronRight from '@mui/icons-material/ChevronRight'

export const FaqCard = ({question, answer}: {question: string; answer: string}) => {
  const [open, setOpen] = useState(false)
  return (
    <Box
      sx={{
        transition: t => t.transitions.create('all'),
      }}
      className={style.root + (open ? ' ' + style.rootOpened : '')}
    >
      <div className={style.title}>
        <IconButton
          onClick={() => setOpen(_ => !_)}
          sx={{
            transition: t => t.transitions.create('all'),
            ...(open ? {transform: 'rotate(90deg)'} : {}),
          }}
        >
          <ChevronRight />
        </IconButton>
        <div className={style.question} dangerouslySetInnerHTML={{__html: question}} />
      </div>
      <Collapse in={open}>
        <div className={style.answer} dangerouslySetInnerHTML={{__html: answer}} />
      </Collapse>
    </Box>
  )
}
