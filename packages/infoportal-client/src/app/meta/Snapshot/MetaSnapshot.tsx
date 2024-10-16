import React, {useMemo} from 'react'
import {Period} from 'infoportal-common'
import {Pdf} from '@/shared/PdfLayout/PdfLayout'
import {Box, Icon, useTheme} from '@mui/material'
import {Txt} from '@/shared/Txt'
import {periodToString} from '@/features/Snapshot/SnapshotPeriod'
import {DRCLogo} from '@/shared/logo/logo'
import {subDays} from 'date-fns'
import {MetaSnapshotEcrec} from '@/app/meta/Snapshot/MetaSnapshotEcrec'
import {MetaSnapshotSnfi} from './MetaSnapshotSnfi'
import {MetaSnapshotProtection} from './MetaSnapshotProtection'
import {MetaSnapshotCashAssistance} from './MetaSnapshotCashAssistance'
import {MetaSnapshotOverview} from './MetaSnapshotOverview'

export const MetaSnapshotHeader = ({
  period,
  subTitle,
}: {
  period: Period
  subTitle: string
}) => {
  const t = useTheme()
  const asString = useMemo(() => periodToString(period), [period])
  return (
    <Box sx={{
      px: 2,
      py: 1,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box>
        <Txt bold sx={{
          fontSize: '1.5em',
          lineHeight: 1.2,
          fontWeight: 300,
          display: 'flex',
          alignItems: 'center',
          // color: t.palette.text.secondary,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            color: t.palette.primary.main,
          }}>
            {/*<Icon sx={{mr: 1, fontSize: 24}}>{icon}</Icon>*/}
            {subTitle}
          </Box>
          &nbsp;-&nbsp;
          Activity Snapshot
        </Txt>
        <Txt color="hint" sx={{fontSize: '1em', display: 'flex', alignItems: 'center'}}>
          <Icon fontSize="small" sx={{mr: .5}}>date_range</Icon> {asString.start}
          {asString.end !== asString.start && (
            <>&nbsp;-&nbsp;{asString.end}</>
          )}
          <Icon fontSize="small" sx={{mr: .5, ml: 2,}}>location_on</Icon> Ukraine
        </Txt>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        <DRCLogo/>
      </Box>
    </Box>
  )
}

export interface MetaSnapshotProps {
  period: Period
}

export const MetaSnapshot = () => {
  const period = {
    start: new Date(2024, 0, 1),
    end: subDays(new Date(2024, 7, 1), 1),
  }
  return (
    <Pdf>
      <MetaSnapshotOverview period={period}/>
      <MetaSnapshotProtection period={period}/>
      <MetaSnapshotSnfi period={period}/>
      <MetaSnapshotEcrec period={period}/>
      <MetaSnapshotCashAssistance period={period}/>
    </Pdf>
  )
}