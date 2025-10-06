import * as React from 'react'
import {ForwardedRef, forwardRef} from 'react'
import {PanelBody, PanelBodyProps} from './PanelBody'
import {Panel, PanelProps} from './Panel'

export type PanelWBodyProps = PanelProps & {
  BodyProps?: PanelBodyProps
}

export const PanelWBody = forwardRef(({BodyProps, children, title, ...other}: PanelWBodyProps, ref: ForwardedRef<any>) => {
  return (
    <Panel title={title} {...other} ref={ref}>
      <PanelBody {...BodyProps}>{children}</PanelBody>
    </Panel>
  )
})
