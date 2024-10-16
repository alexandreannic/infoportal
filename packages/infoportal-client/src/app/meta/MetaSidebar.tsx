import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {useMetaContext} from '@/app/meta/MetaContext'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import React, {ReactNode} from 'react'
import {today} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {useI18n} from '@/core/i18n'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {Box, Switch, Typography} from '@mui/material'
import {IpIconBtn} from '@/shared/IconBtn'
import {SidebarSubSection} from '@/shared/Layout/Sidebar/SidebarSubSection'
import {IpBtn} from '@/shared/Btn'
import {appConfig} from '@/conf/AppConfig'
import {metaSiteMap} from '@/app/meta/Meta'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useSession} from '@/core/Session/SessionContext'
import {DashboardFilterOptionsContent} from '@/shared/DashboardLayout/DashboardFilterOptions'
import {IKoboMeta} from 'infoportal-common/kobo'
import {PopoverWrapper, Txt} from '@/shared'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {usePathname} from 'next/navigation'

export const Item = ({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', px: 1, py: .125}}>
      <Txt size="small">{label}</Txt>
      {children}
    </Box>
  )
}

export const MetaSidebar = () => {
  const {m, formatLargeNumber} = useI18n()
  const path = (page: string) => '' + page
  const {data: ctx} = useMetaContext()
  const {api} = useAppSettings()
  const asyncRefresh = useAsync(api.koboMeta.sync)
  const asyncKillCache = useAsync(api.koboMeta.killCache)
  const {toastInfo} = useIpToast()
  const {session} = useSession()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarBody>
        <Link href="/meta/dashboard">
          <SidebarItem active={pathname === 'xx'} icon={appConfig.icons.dashboard}>{m.dashboard}</SidebarItem>
        </Link>
        <Link href="/meta/data">
          <SidebarItem active={pathname === 'zz'} icon={appConfig.icons.dataTable}>{m.data}</SidebarItem>
        </Link>

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

        {router.location.pathname === metaSiteMap.routes.dashboard && (
          <Box sx={{ml: 1}}>
            <Typography variant="caption" noWrap sx={{
              fontWeight: t => t.typography.fontWeightMedium,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: t => t.palette.text.disabled,
              mb: 1,
              display: 'block',
            }}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {m.filters}
                <IpBtn
                  color="primary"
                  size="small"
                  onClick={ctx.clearAllFilter}
                  children={m.clearAll}
                  sx={{marginLeft: 'auto'}}
                />
              </Box>
            </Typography>
            <SidebarSubSection dense title={m.submittedAt} keepOpen>
              <Box sx={{px: 1}}>
                <DebouncedInput<[Date | undefined, Date | undefined]>
                  defaultValue={[ctx.period.start, ctx.period.end]}
                  onChange={([start, end]) => {
                    ctx.setPeriod(prev => ({...prev, start, end}))
                  }}
                >
                  {(value, onChange) => <PeriodPicker
                    value={value}
                    onChange={onChange}
                    label={[m.start, m.endIncluded]}
                    max={today}
                  />}
                </DebouncedInput>
              </Box>
            </SidebarSubSection>
            <SidebarSubSection dense title={m.committedAt} keepOpen>
              <Box sx={{px: 1}}>
                <DebouncedInput<[Date | undefined, Date | undefined]>
                  defaultValue={[ctx.periodCommit.start, ctx.period.end]}
                  onChange={([start, end]) => {
                    ctx.setPeriodCommit(prev => ({...prev, start, end}))
                  }}
                >
                  {(value, onChange) => <PeriodPicker
                    value={value}
                    onChange={onChange}
                    label={[m.start, m.endIncluded]}
                    max={today}
                  />}
                </DebouncedInput>
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
            {Obj.entries(ctx.shape).map(([name, shape]) =>
              <MetaSidebarFilter
                key={name}
                name={name}
                shape={shape}
              />
            )}
          </Box>
        )}
      </SidebarBody>
    </Sidebar>
  )
}

export const MetaSidebarFilter = ({
  name,
  shape,
}: {
  name: string
  shape: DataFilter.Shape<IKoboMeta>
}) => {
  const {data: ctx} = useMetaContext()
  const getFilteredOptions = (name: string) => {
    const filtersCopy = {...ctx.shapeFilters}
    delete filtersCopy[name]
    return DataFilter.filterData(ctx.data ?? seq([]), ctx.shape, filtersCopy)
  }
  const active = ctx.shapeFilters[name] && ctx.shapeFilters[name]!.length > 0
  return (
    <DebouncedInput<string[]>
      key={name}
      debounce={50}
      value={ctx.shapeFilters[name]}
      onChange={_ => ctx.setShapeFilters((prev: any) => ({...prev, [name]: _}))}
    >
      {(value, onChange) =>
        <PopoverWrapper content={() => (
          <DashboardFilterOptionsContent
            value={value ?? []}
            onChange={onChange}
            addBlankOption={shape.addBlankOption}
            options={() => shape.getOptions(() => getFilteredOptions(name))}
          />
        )}>
          <SidebarSubSection
            active={active}
            dense
            icon={shape.icon}
            title={shape.label + (active ? ` (${ctx.shapeFilters[name]!.length})` : '')}
            onClear={active ? (() => {
              ctx.setShapeFilters(_ => ({
                ..._,
                [name]: []
              }))
            }) : undefined}
          />
        </PopoverWrapper>
      }
    </DebouncedInput>
  )
}
