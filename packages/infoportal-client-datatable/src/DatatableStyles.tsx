import {GlobalStyles} from '@mui/material'

export const DatatableGlobalStyles = () => (
  <GlobalStyles
    styles={theme => ({
      '.dt': {
        minWidth: '100%',
        overflow: 'auto',
        height: 'calc(100vh - 150px)',
        '.MuiCheckbox-root': {
          padding: 6,
        },
      },

      '.dtbody': {
        userSelect: 'none',
      },

      '.dtr': {
        display: 'grid',
        gridTemplateColumns: 'var(--cols)', // keep dynamic cols
        willChange: 'transform',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      },

      '.dtd': {
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
        backgroundColor: theme.vars.palette.background.paper,

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

      '.dt-toolbar': {
        padding: `calc(${theme.vars.spacing} * 0.5)`,
        display: 'flex',
        alignItems: 'center',
      },

      '.td-index': {
        justifyContent: 'center',
        padding: 0,
        background: 'none',
        color: theme.vars.palette.text.disabled,

        '&.selected': {
          border: 'none',
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main}, transparent 70%)`,
          color: theme.vars.palette.primary.main,
        },
      },

      // Thead
      '.dthead': {
        verticalAlign: 'middle',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(30px) saturate(150%)',
        background: `rgb(${theme.vars.palette.AppBar?.defaultBg} / 0.4)`,
        boxShadow: theme.vars.shadows[1],
        width: 'max-content',
      },

      '.dtrh': {
        height: 30,
        display: 'grid',
        gridTemplateColumns: 'var(--cols)', // dynamic from JS
        position: 'sticky',
      },

      '.dth': {
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

        '&:hover': {
          background: theme.vars.palette.primary.main,
        },
      },
    })}
  />
)
