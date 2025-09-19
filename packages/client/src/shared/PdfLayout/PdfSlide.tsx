import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import React, {ReactNode, useEffect, useRef} from 'react'
import {usePdfContext} from './PdfLayout'
import {uppercaseHandlingAcronyms} from 'infoportal-common'
import {Core} from '@/shared'

export const PdfSlide = ({
  format = 'horizontal',
  allowOverflow,
  ...props
}: {allowOverflow?: boolean; format?: 'horizontal' | 'vertical'} & BoxProps) => {
  const x = '29.7cm'
  const y = '21.0cm'
  const width = format === 'horizontal' ? x : y
  const height = format === 'horizontal' ? y : x
  return (
    <Box
      {...props}
      sx={{
        background: t => t.vars.palette.background.default,
        p: 0,
        // overflow: 'hidden',
        width,
        height: allowOverflow ? undefined : height,
        '@media screen': {
          // aspectRatio: (297 / 210) + '',
          height: allowOverflow ? undefined : height,
          width,
          mb: 16,
          borderRadius: '6px',
          boxShadow: t => t.vars.shadows[1],
        },
        // pageBreakAfter: 'always',
        ...props.sx,
      }}
    />
  )
}

export const SlideH1 = ({children, sx, ...props}: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        fontSize: '1.25em',
        fontWeight: t => t.typography.fontWeightBold,
        lineHeight: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export const SlideTxt = ({children, sx, textAlign = 'justify', ...props}: Core.TxtProps) => {
  return (
    <Core.Txt
      {...props}
      size="big"
      textAlign={textAlign}
      sx={{
        // borderLeft: t => `2px solid ${t.vars.palette.divider}`,
        // pl: 1,
        lineHeight: 1.5,
        ...sx,
      }}
    >
      {typeof children === 'string' ? <div dangerouslySetInnerHTML={{__html: children}} /> : children}
    </Core.Txt>
  )
}

export const Div = ({
  children,
  sx,
  column,
  title,
  responsive,
  ...props
}: Omit<BoxProps, 'flexDirection'> & {
  responsive?: boolean
  column?: boolean
}) => {
  const theme = useTheme()
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        width: '100%',
        minWidth: 0,
        flex: 1,
        [theme.breakpoints.down('md')]: responsive
          ? {
              flexDirection: 'column',
              '& > :not(:last-child)': {
                mb: 2,
                mr: 0,
                flex: 1,
              },
            }
          : {},
        ...(column
          ? {
              flexDirection: 'column',
              // '& > *': {
              //   flex: 1
              // },
            }
          : {
              alignItems: 'flex-start',
            }),
        '& > :not(:last-child)': column ? {mb: 2} : {mr: 2},
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export const SlideHeader = ({
  children,
  logo,
}: BoxProps & {
  logo?: ReactNode
}) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderBottom: t => `1px solid ${t.vars.palette.divider}`,
        mb: 0,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Core.Txt bold sx={{fontSize: '1.42em'}}>
        {children}
      </Core.Txt>
      <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>{logo}</Box>
    </Box>
  )
}

export const PdfSlideBody = (props: BoxProps) => {
  const {pdfTheme} = usePdfContext()
  return <Box {...props} sx={{p: 2, pb: 0, ...props.sx}} />
}

export const SlidePanelTitle = ({
  icon,
  uppercase = true,
  dangerouslySetInnerHTML,
  sx,
  children,
  ...props
}: {icon?: string} & Core.TxtProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = uppercaseHandlingAcronyms(ref.current.innerHTML)
  }, [children])

  return (
    <Core.Txt
      block
      // size="big"
      bold
      sx={{display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '1.05em', lineHeight: 1.15, mr: -1, ...sx}}
      color="hint"
      {...props}
    >
      {icon && (
        <Icon color="disabled" sx={{mr: 0.5}}>
          {icon}
        </Icon>
      )}
      <div ref={ref as any}>
        {dangerouslySetInnerHTML ? <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} /> : children}
      </div>
    </Core.Txt>
  )
}

export const SlidePanel = ({
  savableAsImg = false,
  expendable = false,
  children,
  sx,
  BodyProps,
  ...props
}: Core.PanelProps & {BodyProps?: Omit<Core.PanelBodyProps, 'ref' | 'children'>}) => {
  return (
    <Core.Panel
      elevation={0}
      {...props}
      savableAsImg={savableAsImg}
      expendable={expendable}
      sx={{
        mt: 0,
        mb: 0,
        mr: 0,
        ml: 0,
        ...sx,
      }}
    >
      <Core.PanelBody {...BodyProps}>{children}</Core.PanelBody>
    </Core.Panel>
  )
}

export const SlideWidget = ({
  sx,
  children,
  title,
  icon,
  ...props
}: Omit<Core.PanelProps, 'title' | 'expendable' | 'savableAsImg'> & {
  icon?: string | ReactNode
  title: string
}) => {
  const t = useTheme()
  return (
    <SlidePanel
      {...props}
      expendable={false}
      savableAsImg={false}
      BodyProps={{
        sx: {
          px: 0.25,
          pb: t.vars.spacing + ' !important',
        },
      }}
      sx={{
        minHeight: 76,
        // minHeight: 82.52,
        width: '100%',
        textAlign: 'center',
        '&:last-child': {
          mr: 0,
        },
        ...sx,
      }}
    >
      <Core.Txt block color="hint" bold sx={{lineHeight: 1, mb: 0.5, mt: -0.5}}>
        {uppercaseHandlingAcronyms(title)}
      </Core.Txt>
      <Box
        sx={{
          lineHeight: 1,
          fontWeight: t => t.typography.fontWeightBold,
          fontSize: '1.7em',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 32,
        }}
      >
        {icon &&
          (typeof icon === 'string' ? (
            <Icon color="disabled" sx={{mr: 1}} fontSize="large">
              {icon}
            </Icon>
          ) : (
            icon
          ))}
        {children}
      </Box>
    </SlidePanel>
  )
}
