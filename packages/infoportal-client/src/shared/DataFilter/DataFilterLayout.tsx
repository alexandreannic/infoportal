import {themeLightScrollbar} from '@/core/theme'
import React, {Dispatch, ReactNode, SetStateAction, useCallback} from 'react'
import {Box, BoxProps} from '@mui/material'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {Obj, Seq, seq} from '@axanc/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/shared/DashboardLayout/DashboardFilterOptions'
import {IpIconBtn} from '@/shared/IconBtn'
import {useI18n} from '@/core/i18n'
import {DataFilterLayoutPopup} from '@/shared/DataFilter/DataFilterLayoutPopup'

export interface FilterLayoutProps extends Pick<BoxProps, 'sx'> {
  readonly onClear?: (name?: string) => void
  readonly filters: Record<string, string[] | undefined>
  readonly setFilters: Dispatch<SetStateAction<Record<string, undefined | string[]>>>
  readonly before?: ReactNode
  readonly after?: ReactNode
  readonly data?: Seq<any>
  readonly shapes: Record<string, DataFilter.Shape<any, any>>
}

export const DataFilterLayout = ({
  sx,
  hidePopup,
  ...props
}: FilterLayoutProps & {
  hidePopup?: boolean
}) => {
  const {m} = useI18n()
  const {before, after, shapes, filters, setFilters, data, onClear} = props

  const getFilteredOptions = useCallback(
    (name: string) => {
      const filtersCopy = {...filters}
      delete filtersCopy[name]
      return DataFilter.filterData(data ?? seq([]), shapes, filtersCopy)
    },
    [filters, shapes, data],
  )

  return (
    <Box
      sx={{
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          mt: -1,
          mb: 1,
          pt: 2,
          pb: 0.5,
          display: 'flex',
          alignItems: 'center',
          ...themeLightScrollbar,
          whiteSpace: 'nowrap',
          '& > *': {
            mr: 0.5,
          },
          ...(sx as any),
        }}
      >
        {before}
        {Obj.entries(shapes).map(([name, shape]) => (
          <DebouncedInput<string[]>
            key={name}
            debounce={50}
            value={filters[name]}
            onChange={(_) => setFilters((prev: any) => ({...prev, [name]: _}))}
          >
            {(value, onChange) => (
              <DashboardFilterOptions
                icon={shape.icon}
                value={value ?? []}
                label={shape.label}
                addBlankOption={shape.addBlankOption}
                options={() => shape.getOptions(() => getFilteredOptions(name))}
                onChange={onChange}
              />
            )}
          </DebouncedInput>
        ))}
        {after}
      </Box>
      <Box
        sx={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          mt: 1.25,
        }}
      >
        {!hidePopup && (
          <DataFilterLayoutPopup
            {...props}
            onConfirm={setFilters}
            filters={filters}
            onClear={onClear}
            getFilteredOptions={getFilteredOptions}
          />
        )}
        {onClear && <IpIconBtn children="clear" tooltip={m.clearFilter} onClick={() => onClear()} />}
      </Box>
    </Box>
  )
}
