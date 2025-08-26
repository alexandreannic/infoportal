import * as React from 'react'
import {forwardRef} from 'react'
import {PanelBody} from './PanelBody.js'
import {Panel, PanelProps} from './Panel.js'

export type PanelWBodyProps = PanelProps

export const PanelWBody = forwardRef(({children, title, ...other}: PanelWBodyProps, ref: any) => {
  return (
    <Core.Panel title={title} {...other}>
      <Core.PanelBody>{children}</Core.PanelBody>
    </Core.Panel>
  )
})
