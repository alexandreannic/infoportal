import {green, orange, purple, red} from '@mui/material/colors'
import {alpha, createTheme, darken, SxProps, Theme} from '@mui/material'
import {lighten} from '@mui/system/colorManipulator'

export const combineSx = (...sxs: (SxProps<Theme> | undefined | false)[]): SxProps<Theme> => {
  return sxs.reduce((res, sx) => (sx !== undefined && sx !== false ? {...res, ...sx} : res), {} as any)
}

export const makeSx = <T>(_: {[key in keyof T]: SxProps<Theme>}) => _
export const makeStyle = (_: SxProps<Theme>) => _

export const sxUtils = makeSx({
  fontBig: {
    fontSize: t => t.typography.fontSize * 1.15,
  },
  fontNormal: {
    fontSize: t => t.typography.fontSize,
  },
  fontSmall: {
    fontSize: t => t.typography.fontSize * 0.85,
  },
  fontTitle: {
    fontSize: t => t.typography.fontSize * 1.3,
  },
  fontBigTitle: {
    fontSize: t => t.typography.fontSize * 1.6,
  },
  tdActions: {
    textAlign: 'right',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  } as const,
  inlineIcon: {
    display: 'inline !important',
    fontSize: 'inherit',
    lineHeight: 1,
    verticalAlign: 'text-top',
  },
  divider: {
    mt: 2,
    mb: 2,
  },
} as const)

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
}): string => `0px ${y}px ${blur}px ${spread}px ${alpha(color, opacity)}`

const lightShadows = Array.from({length: 25}, (_, i) =>
  i === 0
    ? 'none'
    : fadeShadow({
        color: '#000',
        opacity: 0.08 + i * 0.004,
        y: 2 + i * 0.5,
        blur: 5 + i * 0.5,
      }),
)

const createDarkShadows = (primaryColor: string): string[] => {
  return Array.from({length: 25}, (_, i) =>
    i === 0
      ? 'none'
      : fadeShadow({
          color: alpha(primaryColor, 1), // full color
          opacity: 0.12 + i * 0.004, // slightly stronger opacity for dark
          y: 2 + i * 0.5,
          blur: 5 + i * 0.5,
        }),
  )
}

export const styleUtils = (t: Theme) => ({
  gridSpacing: 3 as any,
  fontSize: {
    big: t.typography.fontSize * 1.15,
    normal: t.typography.fontSize,
    small: t.typography.fontSize * 0.85,
    title: t.typography.fontSize * 1.3,
    bigTitle: t.typography.fontSize * 1.6,
  },
  spacing: (...args: number[]) => {
    const [top = 0, right = 0, bottom = 0, left = 0] = args ?? [1, 1, 2, 1]
    return `${t.spacing(top)} ${t.spacing(right)} ${t.spacing(bottom)} ${t.spacing(left)}`
  },
  color: {
    toolbar: {
      default: {
        background: t.palette.mode === 'dark' ? t.palette.background.paper : t.palette.background.default, //'rgb(237, 242, 250)',
      }, //'#e9eef6'
      active: {
        background: alpha(t.palette.primary.main, 0.2),
      },
      hover: {
        background: alpha(t.palette.primary.main, 0.1),
      },
    },
    input: {
      active: {},
      hover: {
        background: 'none',
        borderColor: t.palette.primary.main,
      },
      default: {
        minHeight: 37,
        borderRadius: parseInt('' + t.shape.borderRadius) / 2 + 'px',
        border: '1px solid',
        borderColor: t.palette.divider,
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

export const defaultSpacing = 8

export type AppThemeParams = {
  mainColor?: string
  fontSize?: number
  cardElevation?: number
  dark?: boolean
  spacing?: number
}

export const muiTheme = ({
  dark,
  mainColor = '#0073e6',
  // mainColor = '#c9000a',
  cardElevation,
  spacing = defaultSpacing,
  fontSize = 14,
}: AppThemeParams = {}): Theme => {
  const defaultRadius = 12
  const fontFamily = '"Open Sans", sans-serif'
  // const mainColor = '#af161e'
  const colorPrimary = purple
  // {
  //   main: mainColor,
  //   light: alpha(mainColor, 0.4),
  //   dark: darken(mainColor, 0.4),
  // }
  const colorSecondary = {
    main: '#1a73e8',
    light: lighten('#1a73e8', 0.3),
    dark: darken('#1a73e8', 0.3),
  }

  return createTheme({
    defaultColorScheme: dark ? 'dark' : 'light',
    // cssVariables: {
    //   colorSchemeSelector: 'class',
    // },
    shadows: lightShadows as any,
    spacing,
    colorSchemes: {
      light: {
        palette: {
          warning: orange,
          success: green,
          primary: colorPrimary,
          secondary: colorSecondary,
          error: red,
          action: {
            focus: alpha(mainColor, 0.1),
            focusOpacity: 0.1,
          },
          background: {
            default: 'rgba(221, 231, 248, 0.6)',
            // default: 'rgba(255, 255, 255, 0.6)',
            paper: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
      dark: {
        palette: {
          warning: orange,
          success: green,
          primary: colorPrimary,
          secondary: colorSecondary,
          error: red,
          action: {
            focus: alpha(mainColor, 0.1),
            focusOpacity: 0.1,
          },
          background: {
            default: '#031525',
            paper: '#0d2136',
          },
        },
      },
    },
    shape: {
      borderRadius: defaultRadius,
    },
    typography: {
      fontSize,
      fontFamily,
      fontWeightBold: 500,
      h1: {
        fontSize: '2.4em',
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: '1.5em',
        fontWeight: 500,
      },
      h2: {
        fontSize: '1.7em',
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.3em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: t => ({
          '*': {
            boxSizing: 'border-box',
          },
          // '.MuiDateRangeCalendar-root > div:first-child': {
          //   display: 'none',
          // },
          '@font-face': {
            fontFamily: 'Material Icons',
            fontStyle: 'normal',
            fontWeight: 400,
            src: 'url(https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format("woff2")',
          },
          // '.Mui-error': {
          //   color: theme.palette.error.main + ' !important',
          // },
          '.recharts-surface': {
            overflow: 'visible',
          },
          '@page': {
            // marginTop: '80px',
            paddingTop: '80px',
          },
          '.MuiIcon-root': {
            verticalAlign: 'middle',
            lineHeight: 1,
            fontFamily: "'Material Symbols Outlined'",
            fontSize: 24,
            fontStyle: 'normal',
            fontWeight: 'normal',
            letterSpacing: 'normal',
            textTransform: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            direction: 'ltr',
            fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
          },
          b: {
            fontWeight: 'bold',
          },
          html: {
            fontSize: fontSize,
            fontFamily,
          },
          button: {
            fontFamily,
          },
          '.aa-datepicker-min::-webkit-calendar-picker-indicator': {
            display: 'none',
          },
          body: {
            height: '100vh',
            margin: 0,
            fontSize: '1rem',
            lineHeight: '1.5',
            boxSizing: 'border-box',
            background: t.palette.mode === 'dark' ? t.palette.background.default : 'url(/bg2.png)',
            backgroundSize: 'cover',
            // background: 'linear-gradient(to bottom, #c8e6f9, #f2f4fb)',
            // '&:before': {
            //   content: t.palette.mode == 'light' ? '" "' : undefined,
            //   top: 0,
            //   right: 0,
            //   bottom: 0,
            //   left: 0,
            //   background: 'rgba(255,255,255, .1)',
            //   position: 'fixed',
            // },
          },
          ul: {
            marginTop: '.5em',
          },
          p: {
            ...t.typography.body1,
            textAlign: 'justify',
          },
          '.link': {
            color: t.palette.info.main,
            textDecoration: 'underline',
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
          ':focus': {
            outline: 0,
          },
          '.ip-border': {
            overflow: 'hidden',
            border: `1px solid ${t.palette.divider}`,
            borderRadius: defaultRadius,
          },
          ...tableTheme(t),
        }),
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            zIndex: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            borderRadius: 20,
          },
          outlinedPrimary: ({theme}) => ({
            borderColor: theme.palette.divider,
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: cardElevation ?? 0,
        },
        styleOverrides: {
          root: {
            border: 'none',
            // border: `1px solid ${theme.palette.divider}`,
            //       borderRadius: defaultRadius,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: ({theme}) => ({
            top: 2,
            marginLeft: 2,
            bottom: 2,
            height: 'auto',
            background: alpha(theme.palette.primary.main, 0.18),
            borderRadius: parseInt(theme.shape.borderRadius + '') - 2 + 'px',
          }),
          root: ({theme}) => ({
            background: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius + 'px',
            // boxShadow: theme.shadows[1],
            minHeight: 40,
            borderBottom: 'none !important',
          }),
        },
      },
      MuiGrid: {
        defaultProps: {
          spacing: 1,
        },
      },
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: ({theme}) => ({
            color: theme.palette.text.primary,
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 40,
            minWidth: '80px !important',
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({theme}) => ({
            backdropFilter: 'blur(20px)',
            background: theme.palette.background.paper,
          }),
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          invisible: {
            background: 'none',
            backdropFilter: 'none',
          },
          root: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            // backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: ({theme}) => ({
            borderColor: theme.palette.divider,
          }),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({theme}) => ({
            // fontSize: '1rem',
            // minHeight: 40,
            [theme.breakpoints.up('xs')]: {
              // minHeight: 42,
            },
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            paddingRight: defaultSpacing * 2,
            paddingLeft: defaultSpacing * 2,
            paddingBottom: defaultSpacing,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingRight: defaultSpacing * 2,
            paddingLeft: defaultSpacing * 2,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          sizeSmall: {
            marginBottom: 4,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: 50,
            height: 50,
            paddingRight: 8,
            paddingLeft: 8,
          },
          head: {
            lineHeight: 1.2,
          },
          sizeSmall: {
            height: 40,
            minHeight: 40,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({theme}) => ({
            fontSize: theme.typography.fontSize,
            fontWeight: 'normal',
          }),
        },
      },
      MuiIcon: {
        styleOverrides: {
          root: {
            width: 'auto',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({theme}) => ({
            color: theme.palette.text.primary,
            spacing: 6,
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({theme}) => ({}),
          notchedOutline: ({theme}) => ({
            ...styleUtils(theme).color.input.default,
          }),
          //   theme.palette.mode === 'light'
          //     ? {
          //         '&:hover fieldset': {
          //           borderColor: alpha(colorPrimary.main, 0.1) + ` !important`,
          //         },
          //       }
          //     : {},
          // notchedOutline: ({theme}) =>
          //   theme.palette.mode === 'light'
          //     ? {
          //         transition: 'border-color 140ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          //         // background: 'rgba(255, 255, 255, .5)',
          //         border: 'none',
          //         // background: styleUtils(theme).color.input,
          //         // borderColor: styleUtils(theme).color.inputBorder,
          //       }
          //     : {
          //         borderColor: '#d9dce0',
          //       },
        },
      },
    },
  })
}

const tableTheme = (t: Theme) => ({
  '@keyframes shake': {
    '0%': {transform: 'rotate(0)'},
    '20%': {transform: 'rotate(-25deg)'},
    '40%': {transform: 'rotate(25deg)'},
    '60%': {transform: 'rotate(-12deg)'},
    '80%': {transform: 'rotate(12deg)'},
    '100%': {transform: 'rotate(0)'},
  },
  '.table': {
    minWidth: '100%',
    width: 'max-content',
    // borderTop: '1px solid ' + t.palette.divider,
    // tableLayout: 'fixed',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  '.table-head-type-icon': {
    ml: '2px',
    marginRight: 'auto',
  },
  '.table .MuiCheckbox-root': {
    padding: '6px',
  },
  '.td-id': {
    color: t.palette.info.main,
    fontWeight: 'bold',
    // fontWeight: t.typography.fontWeightBold,
  },
  '.table td:has(.Mui-focused)': {
    border: `1px double ${t.palette.primary.main} !important`,
    boxShadow: `inset 0 0 0 1px ${t.palette.primary.main}`,
  },
  '.table .MuiInputBase-root, .table .MuiFormControl-root': {
    margin: 0,
    height: '100%',
  },
  '.table .MuiInputBase-input': {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },
  '.table .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    borderRadius: 0,
  },
  '.table .tr-clickable': {
    cursor: 'pointer',
  },
  '.table tr': {
    whiteSpace: 'nowrap',
  },
  'table td:has(.MuiOutlinedInput-notchedOutline)': {
    padding: 0,
  },
  // '.table .td-sub-head .MuiButtonBase-root': {
  //   marginTop: -4,
  // },
  '.table .td-sub-head': {
    // height: 20,
    textAlign: 'right',
    padding: 0,
  },
  '.th': {
    width: 80,
  },
  '.table .th.th-width-fit-content': {
    width: '1%',
  },
  '.th-resize': {
    display: 'flex',
    overflow: 'hidden',
    resize: 'horizontal',
    width: 80,
    // width: 102,
    minWidth: '100%',
    // minWidth: 74,
  },
  'td.fw': {
    width: '100%',
  },
  '::-webkit-resizer': {
    background: 'invisible',
  },
  '.table td:first-of-type, .table th:first-of-type': {
    paddingLeft: 8,
  },
  '.table .td-sticky-start': {
    position: 'sticky',
    zIndex: 10,
    left: 0,
    // background: t.palette.background.paper,
    boxShadow:
      'inset -2px 0 1px -1px rgba(0,0,0,0.2), -1px 0px 1px 0px rgba(0,0,0,0.14), -1px 0px 3px 0px rgba(0,0,0,0.12)',
  },
  '.table .td-sticky-end': {
    paddingTop: '1px',
    boxShadow:
      'inset 2px 0 1px -1px rgba(0,0,0,0.2), 1px 0px 1px 0px rgba(0,0,0,0.14), 1px 0px 3px 0px rgba(0,0,0,0.12)',
    position: 'sticky',
    zIndex: 10,
    right: 0,
  },
  '.table tbody tr:not(:last-of-type) td': {
    borderBottom: `1px solid ${t.palette.divider}`,
  },
  '.table tbody td': {
    background: t.palette.background.paper,
    maxWidth: 102,
  },
  '.table thead': {
    // borderTop: `1px solid ${t.palette.divider}`,
  },
  '.table thead .td, .table thead .th': {
    backdropFilter: 'blur(20px)',
    background: styleUtils(t).color.toolbar.default.background,
  },
  '.td-center': {
    textAlign: 'center !important',
  },
  'td-width0': {
    width: 0,
  },
  '.td-right': {
    textAlign: 'right !important',
  },
  '.td-loading': {
    padding: 0,
    border: 'none',
  },
  '.table-loading': {
    padding: 0,
    height: 1,
  },
  '.table td, .table th': {
    alignItems: 'left',
    textAlign: 'left',
    height: 30,
    padding: '0 0px 0 4px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  '.table.borderY td:last-of-type, .table.borderY th:last-of-type': {
    paddingRight: 4,
  },
  '.table.borderY td:not(:last-of-type), .table.borderY th:not(:last-of-type)': {
    borderRight: `1px solid ${t.palette.divider}`,
  },
  '.table th': {
    height: 34,
    zIndex: 2,
    minWidth: 0,
    width: 0,
    top: 0,
    paddingTop: t.spacing(0.25),
    paddingBottom: 0,
    position: 'sticky',
    color: t.palette.text.secondary,
  },
  '.table tbody tr:hover td': {
    background: t.palette.mode === 'dark' ? '#070707' : '#fff',
  },
  //
  // 'table.sheet': {
  //   borderCollapse: 'collapse',
  //   borderSpacing: 0,
  // },
  // '.sheet th': {
  //   textAlign: 'left',
  // },
  // '.sheet td': {
  //   padding: '2px',
  //   borderBottom: `1px solid ${theme.palette.divider}`
  //   // background: 'red',
  // },
})

export const themeLightScrollbar: SxProps<Theme> = {
  overflowX: 'auto',
  scrollbarWidth: 'tin',
  // '&::-webkit-scrollbar-track': {
  //   boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
  // },
  '&::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
  },
  '&::-webkit-scrollbar-track': {
    borderTop: t => '1px solid ' + t.palette.divider,
    // borderRadius: 40,
  },
  '&::-webkit-scrollbar-thumb': {
    border: '3px solid transparent',
    height: '4px',
    borderRadius: 40,
    background: t => t.palette.text.disabled,
    backgroundClip: 'content-box',
    // backgroundColor: 'darkgrey',
  },
}

export function getComponentStyleOverride<T = any>(theme: Theme, componentName: string, slot: string): T | undefined {
  const slotOverride = (theme.components as any)?.[componentName]?.styleOverrides?.[slot]

  if (typeof slotOverride === 'function') {
    return slotOverride({theme})
  }

  return slotOverride
}

export const defaultTheme = muiTheme()
