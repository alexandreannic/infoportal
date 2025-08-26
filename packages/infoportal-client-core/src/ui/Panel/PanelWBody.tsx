import * as React from 'react'
import {forwardRef} from 'react'
import {PanelBody} from './PanelBody.js'
import {Panel, PanelProps} from './Panel.js'

export type PanelWBodyProps = PanelProps

export const PanelWBody = forwardRef(({children, title, ...other}: PanelWBodyProps, ref: any) => {
  return (
    <Panel title={title} {...other}>
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
})
