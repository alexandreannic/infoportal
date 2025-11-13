import {Tab, TabProps, Tabs} from '@mui/material'
import {Link, LinkProps, useRouterState} from '@tanstack/react-router'
import React, {Children, isValidElement, ReactElement, ReactNode} from 'react'
import {tsRouter} from '@/Router'

const isTabLink = (el: ReactNode): el is ReactElement<TabLinkProps> => {
  return isValidElement(el) && el.type === TabLink
}

export const TabsLayout = ({children, sx}: {children: ReactNode; sx?: any}) => {
  const currentPath = useRouterState({select: s => s.location}).pathname
  const tabLinkChildren = Children.toArray(children).filter(isTabLink)
  const activeTab =
    tabLinkChildren
      .map(_ => tsRouter.buildLocation({to: _.props.to, params: _.props.params}).pathname)
      .find(path => currentPath.startsWith(path)) ?? false

  return (
    <Tabs
      value={activeTab}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        '& .MuiTab-root': {minHeight: 34, py: 1},
        ...sx,
      }}
    >
      {React.Children.map(children, (child, i) => {
        if (isTabLink(child)) {
          const {to, params, ...rest} = child.props
          const loc = tsRouter.buildLocation({to, params})
          return (
            <Tab
              {...rest as any}
              key={child.key ?? i}
              value={loc.pathname}
              component={Link}
              to={to}
              params={params}
              sx={{minHeight: 34, py: 1, ...rest.sx}}
            />
          )
        }
        return child
      })}
    </Tabs>
  )
}

export type TabLinkProps = Omit<TabProps, 'value'> & Pick<LinkProps, 'to' | 'params'>

export const TabLink = ({}: TabLinkProps) => {
  // Doesn't matter, it will be built in TabsLayout
  return <></>
}
