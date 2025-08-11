import React, {useMemo} from 'react'
import {createTwoFilesPatch} from 'diff'
import {html} from 'diff2html'
import 'react-diff-view/style/index.css'
import 'diff2html/bundles/css/diff2html.min.css'
import {Box, BoxProps, useColorScheme, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'
import {ColorSchemeType} from 'diff2html/lib/types'

type Props = BoxProps & {
  oldStr: string
  newStr: string
  hasChanges?: (_: boolean) => void
}

export const DiffView = ({oldStr = '', newStr, sx, hasChanges, ...props}: Props) => {
  const {mode} = useColorScheme()
  const {m} = useI18n()
  const t = useTheme()
  const __html = useMemo(() => {
    try {
      const diffText = createTwoFilesPatch(
        'old',
        'new',
        oldStr,
        newStr,
        '', // old header
        '', // new header
        {context: 3},
      )
      hasChanges?.(diffText.includes('@@'))
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
  }, [oldStr, newStr])

  return (
    <Box
      sx={{
        borderRadius: t.vars.shape.borderRadius,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        '& .d2h-file-wrapper': {
          border: 'none',
          margin: 0,
        },
        '& .d2h-code-linenumber': {borderLeft: 'none'},
        '& .d2h-code-linenumber:first-of-type': {background: 'none'},
        '& .d2h-file-header': {
          display: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      <Txt bold size="big" block sx={{pl: 2, py: 0.5, borderBottom: '1px solid', borderColor: t.vars.palette.divider}}>
        {m.differences}
      </Txt>
      <Box dangerouslySetInnerHTML={{__html}} />
    </Box>
  )
}
