import {orange, red} from '@mui/material/colors'
import {alpha, createTheme, darken, SxProps, Theme} from '@mui/material'
import {ThemeOptions} from '@mui/material/styles/createTheme'
import {lighten} from '@mui/system/colorManipulator'

export const combineSx = (...sxs: (SxProps<Theme> | undefined | false)[]): SxProps<Theme> => {
  return sxs.reduce((res, sx) => (sx !== undefined && sx !== false ? {...res, ...sx} : res), {} as any)
}

export const makeSx = <T>(_: {[key in keyof T]: SxProps<Theme>}) => _
export const makeStyle = (_: SxProps<Theme>) => _

export const sxUtils = makeSx({
  fontBig: {
    fontSize: (t) => t.typography.fontSize * 1.15,
  },
  fontNormal: {
    fontSize: (t) => t.typography.fontSize,
  },
  fontSmall: {
    fontSize: (t) => t.typography.fontSize * 0.85,
  },
  fontTitle: {
    fontSize: (t) => t.typography.fontSize * 1.3,
  },
  fontBigTitle: {
    fontSize: (t) => t.typography.fontSize * 1.6,
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
    input: 'rgba(100,100,220,.04)',
    // inputBorder: 'rgba(0,0,0,0)',// 'rgba(0, 0, 0, 0.12)',
    inputBorder: 'rgba(0, 0, 0, 0.11)',
    toolbar: t.palette.mode === 'dark' ? t.palette.background.paper : 'rgb(237, 242, 250)', //'#e9eef6',
    // toolbar: t.palette.mode === 'dark' ? t.palette.background.paper :'#ebf1f9',//'#e9eef6',
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
  backgroundPaper?: string
  backgroundDefault?: string
  cardElevation?: number
  dark?: boolean
  spacing?: number
}

export const defaultAppThemeParams = {
  light: {
    backgroundDefault: '#f6f8fc',
    backgroundPaper: '#fff',
  },
  dark: {
    backgroundDefault: '#031525',
    backgroundPaper: '#0d2136',
  },
}

export const muiTheme = ({
  dark,
  mainColor = '#c9000a',
  backgroundPaper,
  backgroundDefault,
  cardElevation,
  spacing = defaultSpacing,
  fontSize = 14,
}: AppThemeParams = {}): Theme => {
  const colorOverOpaque = dark ? '#070707' : '#fafafa'
  const defaultRadius = 12
  const fontFamily = '"Open Sans", sans-serif'
  // const mainColor = '#af161e'
  const colorPrimary = {
    main: mainColor,
    light: alpha(mainColor, 0.4),
    dark: darken(mainColor, 0.4),
  }
  const colorSecondary = {
    main: '#1a73e8',
    light: lighten('#1a73e8', 0.3),
    dark: darken('#1a73e8', 0.3),
  }
  const baseTheme = createTheme({
    spacing,
    palette: {
      action: {
        focus: alpha(mainColor, 0.1),
        focusOpacity: 0.1,
      },
      warning: orange,
      primary: colorPrimary,
      secondary: colorSecondary,
      error: red,
      mode: dark ? 'dark' : 'light',
      background: {
        default:
          backgroundDefault ??
          (dark ? defaultAppThemeParams.dark.backgroundDefault : defaultAppThemeParams.light.backgroundDefault),
        paper:
          backgroundPaper ??
          (dark ? defaultAppThemeParams.dark.backgroundPaper : defaultAppThemeParams.light.backgroundPaper),
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
  })

  const theme: ThemeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
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
          //   color: baseTheme.palette.error.main + ' !important',
          // },
          '.recharts-surface': {
            overflow: 'visible',
          },
          '@page': {
            // marginTop: '80px',
            paddingTop: '80px',
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
            margin: 0,
            fontSize: '1rem',
            lineHeight: '1.5',
            boxSizing: 'border-box',
          },
          ul: {
            marginTop: '.5em',
          },
          p: {
            ...baseTheme.typography.body1,
            textAlign: 'justify',
          },
          '.link': {
            color: baseTheme.palette.info.main,
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
            border: `1px solid ${baseTheme.palette.divider}`,
            borderRadius: defaultRadius,
          },
          ...tableTheme(baseTheme, colorOverOpaque),
        },
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
          outlinedPrimary: {
            borderColor: baseTheme.palette.divider,
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: cardElevation ?? 0,
        },
        styleOverrides: {
          root: {
            border: 'none',
            // border: `1px solid ${baseTheme.palette.divider}`,
            //       borderRadius: defaultRadius,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 0,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 40,
            minWidth: '80px !important',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: baseTheme.palette.divider,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            // fontSize: '1rem',
            // minHeight: 40,
            [baseTheme.breakpoints.up('xs')]: {
              // minHeight: 42,
            },
          },
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
            marginBottom: -4,
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
          tooltip: {
            fontSize: baseTheme.typography.fontSize,
            fontWeight: 'normal',
          },
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
          root: {
            spacing: 6,
          },
        },
      },
      MuiOutlinedInput: dark
        ? {}
        : {
            styleOverrides: {
              root: {
                '&:hover fieldset': {
                  borderColor: alpha(colorPrimary.main, 0.5) + ` !important`,
                },
              },
              notchedOutline: {
                transition: 'border-color 140ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                background: styleUtils(baseTheme).color.input,
                borderColor: styleUtils(baseTheme).color.inputBorder,
              },
            },
          },
    },
  }
  return createTheme({
    ...baseTheme,
    ...theme,
    ...(dark
      ? {
          MuiOutlinedInput: {
            styleOverrides: {
              notchedOutline: {
                borderColor: '#d9dce0',
              },
            },
          },
        }
      : ({} as any)),
  })
}

const tableTheme = (t: Theme, colorOverOpaque: string) => ({
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
    tableLayout: 'fixed',
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
    borderTop: `1px solid ${t.palette.divider}`,
  },
  '.table thead .td, .table thead .th': {
    background: styleUtils(t).color.toolbar,
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
    background: colorOverOpaque,
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
  //   borderBottom: `1px solid ${baseTheme.palette.divider}`
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
    borderTop: (t) => '1px solid ' + t.palette.divider,
    // borderRadius: 40,
  },
  '&::-webkit-scrollbar-thumb': {
    border: '3px solid transparent',
    height: '4px',
    borderRadius: 40,
    background: (t) => t.palette.text.disabled,
    backgroundClip: 'content-box',
    // backgroundColor: 'darkgrey',
  },
}
