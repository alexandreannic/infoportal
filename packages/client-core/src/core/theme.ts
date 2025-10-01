import {SxProps, Theme} from '@mui/material'
import {purple} from '@mui/material/colors'

export const combineSx = (...sxs: (SxProps<Theme> | undefined | false)[]): SxProps<Theme> => {
  return sxs.reduce((res, sx) => (sx !== undefined && sx !== false ? {...res, ...sx} : res), {} as any)
}

export const makeSx = <T>(_: {[key in keyof T]: SxProps<Theme>}) => _
export const makeStyle = (_: SxProps<Theme>) => _

export const alphaVar = (color: string, coef: number) => `rgb(from ${color} r g b / ${coef})`
export const lightenVar = (color: string, coef: number) =>
  `color-mix(in srgb, ${color} ${(1 - coef) * 100}%, white ${coef * 100}%)`
export const darkenVar = (color: string, coef: number) =>
  `color-mix(in srgb, ${color} ${(1 - coef) * 100}%, black ${coef * 100}%)`

export const colorPrimary = purple

const fadeShadow = ({
  color = '#000',
  opacity = 0.1,
  y = 1,
  blur = 4,
  spread = 0,
}: {
  color?: string
  opacity?: number
  y?: number
  blur?: number
  spread?: number
}): string => `0px ${y}px ${blur}px ${spread}px ${alphaVar(color, opacity)}`

export const lightShadows = Array.from({length: 25}, (_, i) =>
  i === 0
    ? 'none'
    : fadeShadow({
        color: '#000',
        opacity: 0.2 + i * 0.01,
        y: 1.5 + i * 0.6,
        blur: 3 + i * 0.3,
      }),
)

export const createDarkShadows = (primaryColor: string): string[] => {
  return Array.from({length: 25}, (_, i) =>
    i === 0
      ? 'none'
      : fadeShadow({
          color: alphaVar(primaryColor, 1), // full color
          opacity: 0.12 + i * 0.004, // slightly stronger opacity for dark
          y: 2 + i * 0.5,
          blur: 5 + i * 0.5,
        }),
  )
}

export const styleUtils = (t: Theme) => ({
  backdropFilter: 'blur(10px)',
  gridSpacing: 3 as any,
  fontSize: {
    big: `calc(${t.typography.fontSize} * 1.15)`,
    normal: `calc(${t.typography.fontSize})`,
    small: `calc(${t.typography.fontSize} * 0.85)`,
    title: `calc(${t.typography.fontSize} * 1.3)`,
    bigTitle: `calc(${t.typography.fontSize} * 1.6)`,
  },
  color: {
    backgroundActive: {
      background:
        t.palette.mode === 'dark'
          ? `color-mix(in srgb, var(--mui-palette-primary-dark) 40%, white 70%)`
          : `color-mix(in srgb, var(--mui-palette-primary-light) 90%, white 60%)`,
      // ? darken(alpha(t.vars.palette.primary.dark, 0.4), 0.7)
      // : lighten(alpha(t.vars.palette.primary.light, 0.9), 0.6),
      backdropFilter: 'blur(6px)',
    },
    toolbar: {
      default: {
        background: 'rgb(235, 240, 249)', // t.vars.palette.background.default,
        ...t.applyStyles('dark', {
          background: darkenVar(t.vars.palette.background.paper, 0.16),
        }),
      }, //'#e9eef6'
      active: {
        background: alphaVar(t.vars.palette.primary.main, 0.2),
      },
      hover: {
        background: alphaVar(t.vars.palette.primary.main, 0.1),
      },
    },
    input: {
      active: {},
      hover: {
        background: 'none',
        borderColor: t.vars.palette.primary.main,
      },
      default: {
        minHeight: 37,
        borderRadius: `calc(${t.vars.shape.borderRadius} / 2)`,
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        background: 'none',
      },
    },
    success: '#00b79f',
    error: '#cf0040',
    warning: '#ff9800',
    info: '#0288d1',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  } as any,
})
