import {GlobalStyles} from '@mui/material'
import {memo} from 'react'

export const DatatableGlobalStyles = () => (
  <GlobalStyles
    styles={theme => ({
      '.dt': {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        minWidth: '100%',
        overflow: 'auto',
        height: 'calc(100vh - 156px)',
        '.MuiCheckbox-root': {
          padding: 6,
        },
      },

      '.dtbody': {
        // gridAutoRows: 'minmax(40px, auto)',
        // userSelect: blockUserSelection ? 'none' : undefined,
      },

      '.dtr': {
        display: 'grid',
        gridTemplateColumns: 'var(--cols)',
        willChange: 'transform',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      },

      '.dtd': {
        height: 32,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
        borderRight: `1px solid ${theme.vars.palette.divider}`,
        textAlign: 'left',
        padding: '0 0 0 4px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        backgroundColor: `rgb(from ${theme.vars.palette.background.paper} r g b)`,

        '&.td-id': {
          color: theme.vars.palette.info.main,
          fontWeight: 'bold',
        },

        '&.td-right': {
          paddingRight: 2,
          paddingLeft: 0,
          justifyContent: 'flex-end',
        },

        '&.td-center': {
          paddingLeft: 0,
          paddingRight: 0,
          justifyContent: 'center',
        },

        '&.skeleton': {
          paddingRight: `calc(${theme.vars.spacing} * 2)`,
          paddingLeft: `calc(${theme.vars.spacing} * 2)`,
        },
      },

      '.dtd.selected': {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main}, transparent 90%)`,
        outline: `1px solid ${theme.vars.palette.primary.main}`,
        borderBottom: `1px solid ${theme.vars.palette.primary.main}`,
        borderRight: `1px solid ${theme.vars.palette.primary.main}`,
      },

      '.td-index': {
        justifyContent: 'center',
        textAlign: 'center',
        padding: 0,
        background: 'none',
        color: theme.vars.palette.text.disabled,

        '&.selected': {
          border: 'none',
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main}, transparent 70%)`,
          color: theme.vars.palette.primary.main,
        },
      },

      // Thead -----
      '.dthead': {
        display: 'grid',
        gridTemplateColumns: 'var(--cols)',
        verticalAlign: 'middle',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(30px) saturate(150%)',
        background: `rgb(${theme.vars.palette.AppBar?.defaultBg} / 0.4)`,
        boxShadow: theme.vars.shadows[1],
        // width: 'max-content',
        width: '100%',
      },

      '.dtrh': {
        display: 'contents',
        position: 'sticky',
      },

      '.dth': {
        height: 32,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 20,
        borderRight: `1px solid ${theme.vars.palette.divider}`,
        textAlign: 'left',
        padding: '0 0 0 4px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },

      '.react-resizable': {
        position: 'relative',
      },

      '.react-resizable-handle-se': {
        background: 'none',
        width: 4,
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        // borderLeft: '1px dashed',
        // borderColor: theme.vars.palette.divider,

        '&:hover': {
          background: theme.vars.palette.primary.main,
        },
      },
    })}
  />
)
