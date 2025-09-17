import {green, orange, purple, red} from '@mui/material/colors'
import {alpha, createTheme, SxProps, Theme} from '@mui/material'
import {Core} from '@/shared'
import {alphaVar, colorPrimary} from '@infoportal/client-core'

export const sxUtils = Core.makeSx({
  fontBig: {
    fontSize: t => `calc(${t.typography.fontSize}px * 1.15)`,
  },
  fontNormal: {
    fontSize: t => t.typography.fontSize,
  },
  fontSmall: {
    fontSize: t => `calc(${t.typography.fontSize}px * 0.85)`,
  },
  fontTitle: {
    fontSize: t => `calc(${t.typography.fontSize}px * 1.3)`,
  },
  fontBigTitle: {
    fontSize: t => `calc(${t.typography.fontSize}px * 1.6)`,
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

/** @deprecated Use from core */
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
        background: t.vars.palette.background.default, //'rgb(237, 242, 250)',
        ...t.applyStyles('dark', {
          background: Core.darkenVar(t.vars.palette.background.paper, 0.16),
        }),
      }, //'#e9eef6'
      active: {
        background: Core.alphaVar(t.vars.palette.primary.main, 0.2),
      },
      hover: {
        background: Core.alphaVar(t.vars.palette.primary.main, 0.1),
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
    success: '#1a7f37',
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
  // mainColor = '#0073e6', // '#c9000a',
  dark,
  cardElevation,
  spacing = defaultSpacing,
  fontSize = 14,
}: AppThemeParams = {}): Theme => {
  const defaultRadius = 12
  const fontFamily = '"Open Sans", sans-serif'
  const colorSecondary = {
    main: '#1a73e8',
    light: Core.lightenVar('#1a73e8', 0.3),
    dark: Core.darkenVar('#1a73e8', 0.3),
  }

  return createTheme({
    defaultColorScheme: dark ? 'dark' : 'light',
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    shadows: Core.lightShadows as any,
    spacing,
    colorSchemes: {
      light: {
        palette: {
          AppBar: {
            defaultBg: 'rgba(245, 245, 247, 1)',
          },
          warning: orange,
          // success: green,
          primary: colorPrimary,
          secondary: colorSecondary,
          error: red,
          action: {
            focus: Core.alphaVar(colorPrimary['500'], 0.1),
            focusOpacity: 0.1,
          },
          background: {
            default: '#fff',
            // default: 'rgba(221, 231, 248, 0.6)',
            // default: 'rgba(255, 255, 255, 0.6)',
            paper: 'rgba(255, 255, 255, 0.65)',
          },
        },
      },
      dark: {
        palette: {
          warning: orange,
          // success: green,
          primary: Core.colorPrimary,
          secondary: colorSecondary,
          error: red,
          action: {
            focus: Core.alphaVar(Core.colorPrimary['500'], 0.1),
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
          //   color: theme.vars.palette.error.main + ' !important',
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
          input: {
            fontFamily: t.typography.fontFamily,
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
            background: 'url(/bg2.png)',
            backgroundSize: 'cover',
            ...t.applyStyles('dark', {
              background: 'var(--mui-palette-background-default)',
            }),
            // Dark mode override
            // '[data-mui-color-scheme="dark"] &': {},
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
            color: t.vars.palette.info.main,
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
            border: `1px solid ${t.vars.palette.divider}`,
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
            // borderRadius: 20,
          },
          outlinedPrimary: ({theme}) => ({
            borderColor: theme.vars.palette.divider,
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
            // border: `1px solid ${theme.vars.palette.divider}`,
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
            background: Core.alphaVar(theme.vars.palette.primary.main, 0.18),
            borderRadius: `calc(${theme.vars.shape.borderRadius} - 2px)`,
            pointerEvents: 'none',
          }),
          root: ({theme}) => ({
            background: theme.vars.palette.background.paper,
            borderRadius: theme.vars.shape.borderRadius,
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
            color: theme.vars.palette.text.primary,
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
            backdropFilter: styleUtils(theme).backdropFilter,
            background: theme.vars.palette.background.paper,
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
            // backgroundColor: 'rgba(255, 255, 255, 0.02)',
            // backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: ({theme}) => ({
            borderColor: theme.vars.palette.divider,
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
      MuiDialog: {
        styleOverrides: {
          paper: ({theme}) => ({
            background: alphaVar(theme.vars.palette.background.paper, 0.75),
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
          colorPrimary: ({theme}) => ({
            // Hack since it's not working by itself anymore after migrating to CSS VARS system.
            color: theme.vars.palette.primary.main,
          }),
          root: ({theme}) => ({
            color: theme.vars.palette.text.primary,
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
          //   theme.vars.palette.mode === 'light'
          //     ? {
          //         '&:hover fieldset': {
          //           borderColor: alpha(colorPrimary.main, 0.1) + ` !important`,
          //         },
          //       }
          //     : {},
          // notchedOutline: ({theme}) =>
          //   theme.vars.palette.mode === 'light'
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

const tableTheme = (t: Theme) => ({})

const tableTheme2 = (t: Theme) => ({
  // '@keyframes shake': {
  //   '0%': {transform: 'rotate(0)'},
  //   '20%': {transform: 'rotate(-25deg)'},
  //   '40%': {transform: 'rotate(25deg)'},
  //   '60%': {transform: 'rotate(-12deg)'},
  //   '80%': {transform: 'rotate(12deg)'},
  //   '100%': {transform: 'rotate(0)'},
  // },
  // '.table': {
  //   minWidth: '100%',
  //   width: 'max-content',
  //   // borderTop: '1px solid ' + t.vars.palette.divider,
  //   // tableLayout: 'fixed',
  //   borderCollapse: 'separate',
  //   borderSpacing: 0,
  // },
  // '.table-head-type-icon': {
  //   ml: '2px',
  //   marginRight: 'auto',
  // },
  // '.table .MuiCheckbox-root': {
  //   padding: '6px',
  // },
  // '.td-id': {
  //   color: t.vars.palette.info.main,
  //   fontWeight: 'bold',
  //   // fontWeight: t.typography.fontWeightBold,
  // },
  // '.table td:has(.Mui-focused)': {
  //   border: `1px double ${t.vars.palette.primary.main} !important`,
  //   boxShadow: `inset 0 0 0 1px ${t.vars.palette.primary.main}`,
  // },
  // '.table .tr-clickable': {
  //   cursor: 'pointer',
  // },
  // '.table tr': {
  //   whiteSpace: 'nowrap',
  // },
  // '.table .td-sub-head': {
  //   // height: 20,
  //   textAlign: 'right',
  //   padding: 0,
  // },
  // '.th': {
  //   width: 80,
  // },
  // '.table .th.th-width-fit-content': {
  //   width: '1%',
  // },
  // '.th-resize': {
  //   display: 'flex',
  //   overflow: 'hidden',
  //   resize: 'horizontal',
  //   width: 80,
  //   // width: 102,
  //   minWidth: '100%',
  //   // minWidth: 74,
  // },
  // 'td.fw': {
  //   width: '100%',
  // },
  // '::-webkit-resizer': {
  //   background: 'invisible',
  // },
  // '.table td:first-of-type, .table th:first-of-type': {
  //   paddingLeft: 8,
  // },
  // '.table .td-sticky-start': {
  //   position: 'sticky',
  //   zIndex: 10,
  //   left: 0,
  //   // background: t.vars.palette.background.paper,
  //   boxShadow:
  //     'inset -2px 0 1px -1px rgba(0,0,0,0.2), -1px 0px 1px 0px rgba(0,0,0,0.14), -1px 0px 3px 0px rgba(0,0,0,0.12)',
  // },
  // '.table .td-sticky-end': {
  //   paddingTop: '1px',
  //   boxShadow:
  //     'inset 2px 0 1px -1px rgba(0,0,0,0.2), 1px 0px 1px 0px rgba(0,0,0,0.14), 1px 0px 3px 0px rgba(0,0,0,0.12)',
  //   position: 'sticky',
  //   zIndex: 10,
  //   right: 0,
  // },
  // '.table tbody tr:not(:last-of-type) td': {
  //   borderBottom: `1px solid ${t.vars.palette.divider}`,
  // },
  // '.table tbody td': {
  //   background: t.vars.palette.background.paper,
  //   maxWidth: 102,
  // },
  // '.table thead': {
  //   // borderTop: `1px solid ${t.vars.palette.divider}`,
  // },
  // '.table thead .td, .table thead .th': {
  //   // backdropFilter: styleUtils(t).backdropFilter,
  //   background: styleUtils(t).color.toolbar.default.background,
  // },
  // '.td-center': {
  //   textAlign: 'center !important',
  // },
  // '.td-width0': {
  //   width: 0,
  // },
  // '.td-right': {
  //   textAlign: 'right !important',
  // },
  // '.td-loading': {
  //   padding: 0,
  //   border: 'none',
  // },
  // '.table-loading': {
  //   padding: 0,
  //   height: 1,
  // },
  // '.table .td, .table .th': {
  //   alignItems: 'left',
  //   textAlign: 'left',
  //   height: 30,
  //   padding: '0 0px 0 4px',
  //   overflow: 'hidden',
  //   whiteSpace: 'nowrap',
  //   textOverflow: 'ellipsis',
  // },
  // '.table.borderY td:last-of-type, .table.borderY th:last-of-type': {
  //   paddingRight: 4,
  // },
  // // '.table.borderY td:not(:last-of-type), .table.borderY th:not(:last-of-type)': {
  // //   borderRight: `1px solid ${t.vars.palette.divider}`,
  // // },
  // '.table.borderY thead td:not(:last-of-type), .table.borderY thead th:not(:last-of-type)': {
  //   borderRight: `1px solid ${t.vars.palette.divider}`,
  // },
  // '.table th': {
  //   height: 34,
  //   zIndex: 2,
  //   minWidth: 0,
  //   width: 0,
  //   top: 0,
  //   paddingTop: `calc(${t.spacing} * 0.25)`,
  //   paddingBottom: 0,
  //   position: 'sticky',
  //   color: t.vars.palette.text.secondary,
  // },
  // '.table tbody tr:hover td': {
  //   background: '#fff',
  //   ...t.applyStyles('dark', {
  //     background: '#070707',
  //   }),
  // },
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
  //   borderBottom: `1px solid ${theme.vars.palette.divider}`
  //   // background: 'red',
  // },
  // Inputs
  // '.table td:has(input)': {
  //   // transition: t.transitions.create('border-color'),
  //   padding: '1px !important',
  //   // borderColor: 'transparent !important',
  // },
  // '.table td:has(input:focus)': {
  //   padding: '0px !important',
  //   border: '2px solid' + ' !important',
  //   borderColor: t.palette.primary.main + ' !important',
  // },
  // '.table td:has(.table-input), .table td:has(.MuiOutlinedInput-notchedOutline)': {
  //   padding: 0,
  // },
  // '.table .MuiInputBase-root, .table .MuiFormControl-root': {
  //   margin: 0,
  //   height: '100%',
  // },
  // '.table .MuiInputBase-input': {
  //   paddingTop: '0 !important',
  //   paddingBottom: '0 !important',
  // },
  // '.table .MuiOutlinedInput-notchedOutline': {
  //   border: 'none',
  //   borderRadius: 0,
  // },
  // '.table .tbody .td-active': {
  //   background: Core.alphaVar(t.palette.primary.main, 0.11) + ' !important',
  //   userSelect: 'none',
  //   border: '1px solid' + ' !important',
  //   borderColor: t.palette.primary.main + ' !important',
  //   borderTopWidth: '1px' + ' !important',
  //   borderBottomWidth: '1px' + ' !important',
  //   // border: '1px solid' + ' !important',
  //   // borderColor: t.palette.primary.main + ' !important',
  //   // borderTopWidth: '1px' + ' !important',
  //   // borderBottomWidth: '1px' + ' !important',
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
    borderTop: t => '1px solid ' + t.vars.palette.divider,
    // borderRadius: 40,
  },
  '&::-webkit-scrollbar-thumb': {
    border: '3px solid transparent',
    height: '4px',
    borderRadius: 40,
    background: t => t.vars.palette.text.disabled,
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
