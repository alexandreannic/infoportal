import {ReactNode} from 'react'
import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import {styleUtils, Txt} from '@infoportal/client-core'
import {Kobo} from 'kobo-sdk'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function ChoicesMapperPanel({children, sx, ...props}: BoxProps) {
  const t = useTheme()
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        borderRadius: styleUtils(t).color.input.default.borderRadius,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export function ChoiceMapper({
  before,
  question,
  choice,
  children,
}: {
  before?: ReactNode
  children: ReactNode
  question: string
  choice: Kobo.Form.Choice
}) {
  const {schema} = useDashboardContext()
  const t = useTheme()
  return (
    <Box
      sx={{
        '&:not(:last-of-type)': {
          borderBottom: '1px solid',
          borderColor: t.vars.palette.divider,
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 0.5,
        // mb: 0.5,
      }}
    >
      {before}
      <Txt truncate title={choice.name} color="hint" sx={{flex: 1}}>
        {schema.translate.choice(question, choice.name)}
      </Txt>
      <Icon color="disabled">arrow_forward</Icon>
      <Box sx={{flex: 1}}>{children}</Box>
    </Box>
  )
}
