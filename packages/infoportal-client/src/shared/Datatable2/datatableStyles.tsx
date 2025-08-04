import {makeStyles} from 'tss-react/mui'

export const useStyles = makeStyles()(t => ({
  container: {
    overflow: 'auto',
    border: '1px solid #ccc',
    fontFamily: '"Segoe UI", sans-serif',
  },
  table: {
    display: 'grid',
  },
  headerCell: {
    position: 'relative',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '2px solid #888',
    borderRight: '1px solid #ccc',
    userSelect: 'none',
    '&:last-child': {borderRight: 'none'},
    background: '#f7f7f7',
  },
  resizer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 5,
    height: '100%',
    cursor: 'col-resize',
    zIndex: 1,
  },
  cell: {
    padding: 8,
    borderBottom: '1px solid #eee',
    borderRight: '1px solid #eee',
    userSelect: 'none',
    '&:last-child': {borderRight: 'none'},
  },
  selected: {
    backgroundColor: '#cce5ff',
  },
}))