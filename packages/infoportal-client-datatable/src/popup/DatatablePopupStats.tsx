import {useDatatable3Context} from '@/core/DatatableContext.js'
import {Popup} from '@/core/reducer.js'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from './DatatablePopover'

export const DatatablePopupStats = ({columnId, event}: Popup.StatsAgs) => {
  const dispatch = useDatatable3Context(_ => _.dispatch)
  const getColumnOptions = useDatatable3Context(_ => _.getColumnOptions)
  const dataFilteredAndSorted = useDatatable3Context(_ => _.dataFilteredAndSorted)
  const columnsIndex = useDatatable3Context(_ => _.columns.indexMap)
  const column = columnsIndex[columnId]
  const close = () => dispatch({type: 'CLOSE_POPUP'})

  switch (column.type) {
    case 'number':
      return (
        <NumberChoicesPopover
          anchorEl={event.target}
          question={columnId}
          mapValues={(_: any) => column.render(_).value as any}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    case 'date': {
      return (
        <DatesPopover
          anchorEl={event.target}
          title={column.head ?? columnId}
          getValue={(_: any) => column.render(_).value as any}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    }
    case 'select_multiple':
    case 'select_one': {
      return (
        <MultipleChoicesPopover
          translations={getColumnOptions(columnId)}
          anchorEl={event.target}
          multiple={column.type === 'select_multiple'}
          getValue={(_: any) => column.render(_).value as any}
          title={column.head}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    }
  }
}
