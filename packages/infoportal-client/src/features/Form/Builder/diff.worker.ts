import {createTwoFilesPatch} from 'diff'
import {html} from 'diff2html'
import {fnSwitch} from '@axanc/ts-utils'
import {ColorSchemeType} from 'diff2html/lib/types.js'

self.onmessage = (e) => {
  const {oldStr, newStr, mode} = e.data
  console.log('CALLED')
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
    const htmlStr = html(diffText, {
      colorScheme: fnSwitch(mode!, {
        dark: ColorSchemeType.DARK,
        light: ColorSchemeType.LIGHT,
        system: ColorSchemeType.AUTO,
      }),
      drawFileList: false,
      matching: 'lines',
      outputFormat: 'line-by-line',
    })
    postMessage({success: true, html: htmlStr, hasChanges: diffText.includes('@@')})
  } catch (err) {
    postMessage({success: false, error: (err as Error).message})
  }
}
