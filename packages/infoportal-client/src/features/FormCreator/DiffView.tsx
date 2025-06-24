// DiffView.tsx
import React, {useMemo} from 'react'
import {createTwoFilesPatch} from 'diff'
import {html} from 'diff2html'
import 'react-diff-view/style/index.css'
import 'diff2html/bundles/css/diff2html.min.css'
import {Box, BoxProps, useColorScheme, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared'
import {fnSwitch, match} from '@axanc/ts-utils'
import {ColorSchemeType} from 'diff2html/lib/types'

type Props = BoxProps & {
  oldJson: any
  newJson: any
}

export const DiffView = ({oldJson, newJson, sx, ...props}: Props) => {
  const {mode} = useColorScheme()
  const oldStr = JSON.stringify(oldJson, null, 2)
  const newStr = JSON.stringify(newJson, null, 2)
  const {m} = useI18n()
  const t = useTheme()
  const __html = useMemo(() => {
    try {
      const diffText = createTwoFilesPatch(
        'old.json',
        'new.json',
        oldStr,
        newStr,
        '', // old header
        '', // new header
        {context: 3},
      )
      return html(diffText, {
        colorScheme: fnSwitch(mode!, {
          dark: ColorSchemeType.DARK,
          light: ColorSchemeType.LIGHT,
          system: ColorSchemeType.AUTO,
        }),
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'line-by-line',
      })
    } catch (e) {
      return 'BUG'
    }
  }, [oldJson, newJson])

  return (
    <Box
      sx={{
        borderRadius: t.shape.borderRadius + 'px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: t.palette.divider,
        '& .d2h-file-wrapper': {
          border: 'none',
          margin: 0,
        },
        '& .d2h-code-linenumber': {borderLeft: 'none'},
        '& .d2h-code-linenumber:first-of-type': {background: 'none'},
        '& .d2h-file-header': {
          display: 'none',
        },
        ...sx
      }}
      {...props}
    >
      <Txt bold size="big" block sx={{pl: 2, py: 0.5, borderBottom: '1px solid', borderColor: t.palette.divider}}>
        {m.differences}
      </Txt>
      <Box dangerouslySetInnerHTML={{__html}} />
    </Box>
  )
}
