import React, {ReactElement, ReactNode} from 'react'

/** To avoid indented tree hell */
export const Provide = ({
  children,
  providers,
}: {
  children: React.ReactNode
  providers: ((children: ReactNode) => ReactElement)[]
}) => {
  return <>{providers.reduceRight((componentTree, component) => component(componentTree), children)}</>
}
