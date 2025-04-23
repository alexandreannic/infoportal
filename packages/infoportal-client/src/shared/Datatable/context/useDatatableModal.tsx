import {Dispatch, SetStateAction, useMemo, useState} from 'react'
import {UseDatatableData} from '@/shared/Datatable/context/useDatatableData'
import {DatatableRow} from '@/shared/Datatable/util/datatableType'

interface ModalProps {
  columnId: string
  event: any
}

const group = (props: ModalProps | undefined, dispatch: Dispatch<SetStateAction<ModalProps | undefined>>) => {
  return {
    close: () => dispatch(undefined),
    open: (columnId: string, event: any) => {
      dispatch({columnId, event})
    },
    get: props,
  }
}

export type DatatableModal<T extends DatatableRow> = ReturnType<typeof useDatatableModal<T>>

export const useDatatableModal = <T extends DatatableRow>({data}: {data: UseDatatableData<T>}) => {
  const [filterPopover, setFilterPopover] = useState<ModalProps | undefined>()
  const [statsPopover, setStatsPopover] = useState<ModalProps | undefined>()

  return useMemo(() => {
    return {
      filterPopover: group(filterPopover, setFilterPopover),
      statsPopover: group(statsPopover, setStatsPopover),
    }
  }, [data, filterPopover, statsPopover])
}
