import {Box, Icon, Popover} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {IpIconBtn} from '@/shared/IconBtn'
import {Obj, Seq} from '@axanc/ts-utils'
import {FilterLayoutProps} from '@/shared/DataFilter/DataFilterLayout'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {IpSelectMultiple} from '@/shared/Select/SelectMultiple'
import {Txt} from '@/shared/Txt'
import {IpBtn} from '@/shared/Btn'
import {useI18n} from '@/core/i18n'

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
      <IpIconBtn children="tune" onClick={(e) => setAnchorEl(e.currentTarget)} />
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
          boxShadow: (t) => t.shadows[4],
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
              <Txt truncate sx={{mx: 1, width: 140, maxWidth: 140}}>
                {shape.label}
              </Txt>
              <Box sx={{flex: 1}}>
                <IpSelectMultiple
                  sx={{maxWidth: 250, width: 250}}
                  value={innerFilters[name] ?? []}
                  onChange={(_) => setInnerFilters((prev: any) => ({...prev, [name]: _}))}
                  options={
                    shape
                      .getOptions(() => getFilteredOptions(name))
                      ?.map((_) => ({value: _.value, children: _.label})) ?? []
                  }
                />
              </Box>
            </Box>
          ))}
          <Box sx={{mt: 1}}>{after}</Box>
          <Box sx={{display: 'flex', mt: 1}}>
            <IpBtn color="primary" onClick={() => setInnerFilters({})}>
              {m.reinitialize}
            </IpBtn>
            <IpBtn color="primary" onClick={handleClose} sx={{marginLeft: 'auto', mr: 1}}>
              {m.close}
            </IpBtn>
            <IpBtn color="primary" variant="contained" onClick={handleSubmit}>
              {m.confirm}
            </IpBtn>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}
