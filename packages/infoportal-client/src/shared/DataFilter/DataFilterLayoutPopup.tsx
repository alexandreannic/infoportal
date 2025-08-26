import {Box, Icon, Popover} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {Obj, Seq} from '@axanc/ts-utils'
import {FilterLayoutProps} from '@/shared/DataFilter/DataFilterLayout'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'

export const DataFilterLayoutPopup = ({
  before,
  after,
  sx,
  shapes,
  filters,
  setFilters,
  onClear,
  onConfirm,
  getFilteredOptions,
  onClose,
}: FilterLayoutProps & {
  getFilteredOptions: (name: string) => Seq<any>
  onConfirm: (_: DataFilter.Filter) => void
  onClose?: () => void
  onClear?: () => void
}) => {
  const {m} = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const [innerFilters, setInnerFilters] = useState(filters)

  useEffect(() => setInnerFilters(filters), [filters])

  const open = !!anchorEl

  const handleClose = () => {
    setAnchorEl(null)
    onClose?.()
  }

  const handleSubmit = () => {
    onConfirm(innerFilters)
    handleClose()
  }

  return (
    <Box sx={{position: 'relative', ...sx}}>
      <Core.IconBtn children="tune" onClick={e => setAnchorEl(e.currentTarget)} />
      <Popover
        disableScrollLock={true}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          boxShadow: t => t.vars.shadows[4],
          overflow: 'hidden',
          // border: 'none',
          // position: 'absolute',
          // top: 46,
        }}
      >
        <Box
          sx={{
            p: 2,
            overflowY: 'auto',
            // maxHeight: '50vh',
          }}
        >
          <Box sx={{mb: 1}}>{before}</Box>
          {Obj.entries(shapes).map(([name, shape]) => (
            <Box key={name} sx={{display: 'flex', alignItems: 'center', mb: 2}}>
              <Icon color="disabled" sx={{minWidth: 22}}>
                {shape.icon}
              </Icon>
              <Core.Txt truncate sx={{mx: 1, width: 140, maxWidth: 140}}>
                {shape.label}
              </Core.Txt>
              <Box sx={{flex: 1}}>
                <Core.SelectMultiple
                  sx={{maxWidth: 250, width: 250}}
                  value={innerFilters[name] ?? []}
                  onChange={_ => setInnerFilters((prev: any) => ({...prev, [name]: _}))}
                  options={
                    shape.getOptions(() => getFilteredOptions(name))?.map(_ => ({value: _.value, children: _.label})) ??
                    []
                  }
                />
              </Box>
            </Box>
          ))}
          <Box sx={{mt: 1}}>{after}</Box>
          <Box sx={{display: 'flex', mt: 1}}>
            <Core.Btn color="primary" onClick={() => setInnerFilters({})}>
              {m.reinitialize}
            </Core.Btn>
            <Core.Btn color="primary" onClick={handleClose} sx={{marginLeft: 'auto', mr: 1}}>
              {m.close}
            </Core.Btn>
            <Core.Btn color="primary" variant="contained" onClick={handleSubmit}>
              {m.confirm}
            </Core.Btn>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}
