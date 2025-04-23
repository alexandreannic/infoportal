import {Box} from '@mui/material'
import {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared/Txt'

export const ViewMoreText = ({
  children,
  limit = 240,
  initialOpen,
}: {
  initialOpen?: boolean
  children: string
  limit?: number
}) => {
  const [open, setOpen] = useState(initialOpen)
  const {m} = useI18n()

  return (
    <Box>
      {open || children.length <= limit ? children : <>{children.substring(0, limit)}...</>}
      {children.length > limit && (
        <Txt sx={{cursor: 'pointer'}} link bold onClick={() => setOpen((_) => !_)}>
          &nbsp;{open ? m.viewLess : m.viewMore}
        </Txt>
      )}
    </Box>
  )
}
