import * as React from 'react'
import {forwardRef} from 'react'
import {PanelBody} from './PanelBody'
import {Panel, PanelProps} from '@/shared/Panel/Panel'

export type PanelWBodyProps = PanelProps

export const PanelWBody = forwardRef(({children, title, ...other}: PanelWBodyProps, ref: any) => {
  return (
    <Panel title={title} {...other}>
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
})
