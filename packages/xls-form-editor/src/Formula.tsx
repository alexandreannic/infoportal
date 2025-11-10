import {Box} from '@mui/material'

export const Formula = ({value}: {value?: string}) => {
  return <Box sx={{fontFamily: 'monospace'}}>{value}</Box>
}
