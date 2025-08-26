import * as React from 'react'
import {ReactNode} from 'react'
import {useTheme} from '@mui/material'
import {useTimeout} from '@axanc/react-hooks'

export interface AnimateListProps {
  delay?: number
  initialDelay?: number
  children?: ReactNode[]
}

export interface AnimateProps {
  delay?: number
  children: any
}

export const Animate = ({children, delay}: AnimateProps) => {
  const [appeared, setAppeared] = React.useState(false)
  const theme = useTheme()

  useTimeout(() => setAppeared(true), delay || 0)

  return React.cloneElement(children, {
    style: {
      transition: theme.transitions.create('all'),
      opacity: appeared ? 1 : 0,
      transform: appeared ? 'translateY(0)' : 'translateY(60px)',
    },
  })
}

export const AnimateList: React.FC<AnimateListProps> = ({children, delay = 0, initialDelay = 0}) => {
  return (
    <>
      {React.Children.map(children, (child, index) =>
        child ? <Animate delay={initialDelay + index * delay}>{child}</Animate> : null,
      )}
    </>
  )
}
