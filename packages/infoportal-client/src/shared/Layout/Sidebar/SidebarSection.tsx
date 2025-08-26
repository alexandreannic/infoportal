import {Box, Collapse} from '@mui/material'
import {ReactNode} from 'react'
import {usePersistentState} from '../../../../../infoportal-client-core/src/hook/usePersistantState'
import {Core} from '@/shared'

export const SidebarSection = ({
  id,
  title,
  children,
  dense,
  defaultOpen = true,
}: {
  id?: string
  defaultOpen?: boolean
  dense?: boolean
  title?: ReactNode
  children: ReactNode
}) => {
  const [open, setOpen] = usePersistentState(defaultOpen, {storageKey: 'sidebar-section-' + (id ?? '') + title})
  const margin = 1 / (dense ? 4 : 2)
  return (
    <Box
      sx={{
        mt: margin,
        pb: margin,
        '&:not(:last-of-type)': {
          borderBottom: t => `1px solid ${t.vars.palette.divider}`,
        },
      }}
    >
      {title && (
        <Box sx={{pl: 0.5, mb: 0, display: 'flex', alignItems: 'center'}}>
          <Core.IconBtn onClick={() => setOpen(_ => !_)} size="small" sx={{mr: 1}}>
            {open ? 'expand_less' : 'expand_more'}
          </Core.IconBtn>
          <Core.Txt uppercase bold color="disabled" sx={{fontSize: '.825em', flex: 1}}>
            {title}
          </Core.Txt>
        </Box>
      )}
      <Collapse in={open}>{children}</Collapse>
    </Box>
  )
}
