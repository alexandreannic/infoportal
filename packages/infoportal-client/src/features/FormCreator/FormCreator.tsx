import {Page} from '@/shared'
import {Box, useTheme} from '@mui/material'

export const FormCreator = () => {
  const t = useTheme()
  const fileId = '1HBMobaEtlDMTvCobU_H0VdfsCqbNNvSUGAtyC8ZBws4'
  return (
    <Page width="full">
      <Box
        sx={{
          height: '89vh',
          border: 'none',
          boxShadow: t.shadows[1],
          borderRadius: t.shape.borderRadius + 'px',
        }}
        component="iframe"
        src={`https://docs.google.com/spreadsheets/d/1HBMobaEtlDMTvCobU_H0VdfsCqbNNvSUGAtyC8ZBws4/edit?gid=0#gid=0`}
        width="100%"
        height="600"
      />
    </Page>
  )
}
