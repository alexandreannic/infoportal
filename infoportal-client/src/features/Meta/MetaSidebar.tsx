import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {useMetaContext} from '@/features/Meta/MetaContext'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import React, {ReactNode, useState} from 'react'
import {today} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {useI18n} from '@/core/i18n'
import {FilterLayoutProps} from '@/shared/DataFilter/DataFilterLayout'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {Badge, Box, capitalize, Switch, useTheme} from '@mui/material'
import {MetaSidebarSelect} from '@/features/Meta/MetaSidebarSelect'
import {IpIconBtn} from '@/shared/IconBtn'
import {SidebarSubSection} from '@/shared/Layout/Sidebar/SidebarSubSection'
import {SidebarTitle} from 'mui-extension'
import {IpBtn} from '@/shared/Btn'
import {appConfig} from '@/conf/AppConfig'
import {NavLink} from 'react-router-dom'
import {metaSiteMap} from '@/features/Meta/Meta'
import {useLocation} from 'react-router'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useSession} from '@/core/Session/SessionContext'

export const Item = ({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) => {
  const {m} = useI18n()
  return (
    <Box sx={{display: 'flex', alignItems: 'center', px: 1, py: .25}}>
      {label}
      {children}
    </Box>
  )
}

export const MetaSidebar = () => {
  const {m, formatLargeNumber} = useI18n()
  const path = (page: string) => '' + page
  const {data: ctx} = useMetaContext()
  const location = useLocation()
  const {api} = useAppSettings()
  const asyncRefresh = useAsync(api.koboMeta.sync)
  const asyncKillCache = useAsync(api.koboMeta.killCache)
  const {toastInfo} = useIpToast()
  const {session} = useSession()

  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapseAll = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(metaSiteMap.routes.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon={appConfig.icons.dashboard}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(metaSiteMap.routes.data)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon={appConfig.icons.dataTable}>{m.data}</SidebarItem>
          )}
        </NavLink>

        {session.admin && (
          <SidebarItem
            icon="refresh"
            onClick={() => asyncRefresh.call().then(() => toastInfo(m._meta.refreshLong))}
          >
            {m._meta.refresh}
            <IpIconBtn
              color="primary"
              loading={asyncRefresh.loading}
              sx={{marginLeft: 'auto'}}
              children="cloud_sync"
            />
          </SidebarItem>
        )}
        {session.admin && (
          <SidebarItem
            icon="no_sim"
            onClick={() => asyncKillCache.call()}
          >
            {m._meta.killCache}
            <IpIconBtn
              sx={{marginLeft: 'auto'}}
              color="primary"
              loading={asyncKillCache.loading}
              children="refresh"
            />
          </SidebarItem>
        )}
        <SidebarItem href={appConfig.externalLink.metaDashboardReadMe} icon="info" iconEnd="open_in_new" target="_blank" children="Read Me"/>
        <SidebarHr/>

        {location.pathname === metaSiteMap.routes.dashboard && (
          <Box sx={{ml: 1}}>
            <SidebarTitle sx={{display: 'block', mb: 1}}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {m.filters}
                <IpBtn
                  color="primary"
                  size="small"
                  onClick={handleCollapseAll}
                  children={isCollapsed ? m.expandAll : m.collapseAll}
                  sx={{marginLeft: 'auto'}}/>
                <IpBtn
                  color="primary"
                  size="small"
                  onClick={ctx.clearAllFilter}
                  children={m.clearAll}
                  sx={{marginLeft: 'auto'}}
                />
              </Box>
            </SidebarTitle>
            <SidebarSubSection title={m.submittedAt} keepOpen>
              <Box sx={{px: 1, mt: 1}}>
                <PeriodPicker
                  defaultValue={[ctx.period.start, ctx.period.end]}
                  onChange={([start, end]) => {
                    ctx.setPeriod(prev => ({...prev, start, end}))
                  }}
                  label={[m.start, m.endIncluded]}
                  max={today}
                />
              </Box>
            </SidebarSubSection>
            <SidebarSubSection title={m.committedAt} keepOpen>
              <Box sx={{px: 1, mt: 1}}>
                <PeriodPicker
                  defaultValue={[ctx.periodCommit.start, ctx.period.end]}
                  onChange={([start, end]) => {
                    ctx.setPeriodCommit(prev => ({...prev, start, end}))
                  }}
                  label={[m.start, m.endIncluded]}
                  max={today}
                />
              </Box>
            </SidebarSubSection>
            <SidebarSubSection title={m.distinct} icon="join_inner">
              <Item label={m._meta.distinctBySubmission}>
                <Switch
                  sx={{marginLeft: 'auto'}}
                  size="small"
                  checked={ctx.distinctBy.has('submission')}
                  onChange={e => ctx.setDistinctBy('submission', e.currentTarget.checked)}
                />
              </Item>
              <Item label={m._meta.distinctByTaxId}>
                <Switch
                  sx={{marginLeft: 'auto'}}
                  size="small"
                  checked={ctx.distinctBy.has('taxId')}
                  onChange={e => ctx.setDistinctBy('taxId', e.currentTarget.checked)}
                />
              </Item>
              <Item label={m._meta.distinctByPhone}>
                <Switch
                  sx={{marginLeft: 'auto'}}
                  size="small"
                  checked={ctx.distinctBy.has('phone')}
                  onChange={e => ctx.setDistinctBy('phone', e.currentTarget.checked)}
                />
              </Item>
            </SidebarSubSection>
            <MetaDashboardSidebarBody
              data={ctx.data}
              filters={ctx.shapeFilters}
              shapes={ctx.shape}
              setFilters={ctx.setShapeFilters}
              isCollapsed={isCollapsed}
              onClear={(name?: string) => {
                if (name) {
                  ctx.setShapeFilters(_ => ({
                    ..._,
                    [name]: []
                  }))
                } else {
                  ctx.setShapeFilters({})
                  ctx.setPeriod({})
                }
              }}
            />
          </Box>
        )}
      </SidebarBody>
    </Sidebar>
  )
}

export const MetaDashboardSidebarBody = (props: FilterLayoutProps & {isCollapsed: boolean}) => {
  const t = useTheme()
  const getFilteredOptions = (name: string) => {
    const filtersCopy = {...filters}
    delete filtersCopy[name]
    return DataFilter.filterData(data ?? seq([]), shapes, filtersCopy)
  }

  const {
    shapes,
    filters,
    setFilters,
    data,
    onClear,
    isCollapsed
  } = props
  return (
    <>
      {Obj.entries(shapes).map(([name, shape]) =>
        <SidebarSubSection icon={shape.icon} title={
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {capitalize(name)}
            <Badge
              color="primary"
              // anchorOrigin={{
              //   vertical: 'top',
              //   horizontal: 'left',
              variant={filters[name]?.length ?? 0 > 0 ? 'dot' : undefined}
              // badgeContent={filters[name]?.length}
              sx={{color: t.palette.text.secondary, marginLeft: 'auto', mr: .25}}
            >
              <IpIconBtn children="clear" size="small" onClick={() => onClear?.(name)}/>
            </Badge>
          </Box>
        } key={name} isCollapsed={isCollapsed} defaultOpen={filters[name] !== undefined}>
          {filters[name] !== undefined}
          <DebouncedInput<string[]>
            key={name}
            debounce={50}
            value={filters[name]}
            onChange={_ => setFilters((prev: any) => ({...prev, [name]: _}))}
          >
            {(value, onChange) =>
              <MetaSidebarSelect
                icon={shape.icon}
                value={value ?? []}
                label={shape.label}
                addBlankOption={shape.addBlankOption}
                options={() => shapes[name].getOptions(() => getFilteredOptions(name))}
                onChange={onChange}
                isCollapsed={isCollapsed}
                sx={{mb: .5}}
              />
            }
          </DebouncedInput>
        </SidebarSubSection>
      )}
    </>
  )
}