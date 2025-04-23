import {DatatableFilterValue} from '@/shared/Datatable/util/datatableType'
import {DatatableFilterModal} from '@/shared/Datatable/popover/DatatableFilterModal'
import React from 'react'
import {map} from '@axanc/ts-utils'
import {useDatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from '@/shared/Datatable/popover/DatatablePopover'

export const DatatableModal = () => {
  const ctx = useDatatableContext()
  return (
    <>
      {map(ctx.modal.filterPopover.get, (popover) => {
        const id = popover.columnId
        const column = ctx.columnsIndex[id]
        if (!column.type) return
        return (
          <DatatableFilterModal
            data={ctx.data.filterExceptBy(id) ?? []}
            title={column.head}
            anchorEl={popover.event.target}
            columnId={id}
            renderValue={(_: any) => column.render(_).value}
            options={ctx.options(id)}
            type={column.type}
            orderBy={ctx.data.search.orderBy}
            sortBy={ctx.data.search.sortBy}
            onOrderByChange={(_) => ctx.data.onOrderBy(id, _)}
            value={ctx.data.filters[id] as any}
            filterActive={!!ctx.data.filters[id]}
            onClose={ctx.modal.filterPopover.close}
            onClear={() =>
              ctx.data.setFilters((prev) => {
                if (prev) {
                  delete prev[id]
                }
                // setFilteringProperty(undefined)
                return {...prev}
              })
            }
            onChange={(p: string, v: DatatableFilterValue) => {
              ctx.data.setFilters((_) => ({..._, [p]: v}))
              ctx.data.setSearch((prev) => ({...prev, offset: 0}))
              ctx.modal.filterPopover.close()
            }}
          />
        )
      })}

      {map(ctx.modal.statsPopover.get, (popover) => {
        const id = popover.columnId
        const column = ctx.columnsIndex[id]
        switch (column.type) {
          case 'number':
            return (
              <NumberChoicesPopover
                anchorEl={popover.event.target}
                question={id}
                mapValues={(_: any) => column.render(_).value as any}
                data={ctx.data.filteredData ?? []}
                onClose={ctx.modal.statsPopover.close}
              />
            )
          case 'date': {
            return (
              <DatesPopover
                anchorEl={popover.event.target}
                title={column.head ?? id}
                getValue={(_: any) => column.render(_).value as any}
                data={ctx.data.filteredData ?? []}
                onClose={ctx.modal.statsPopover.close}
              />
            )
          }
          case 'select_multiple':
          case 'select_one': {
            return (
              <MultipleChoicesPopover
                translations={ctx.options(id)}
                anchorEl={popover.event.target}
                multiple={column.type === 'select_multiple'}
                getValue={(_: any) => column.render(_).value as any}
                title={column.head}
                data={ctx.data.filteredData ?? []}
                onClose={ctx.modal.statsPopover.close}
              />
            )
          }
        }
      })}
    </>
  )
}
