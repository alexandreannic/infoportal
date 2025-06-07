import {NavLink} from 'react-router-dom'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {Icon, Skeleton, Tooltip, useTheme} from '@mui/material'
import {Fender, Txt} from '@/shared'
import {Obj, seq, Seq} from '@axanc/ts-utils'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import React, {useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {KoboFormSdk, KoboParsedFormName} from '@/core/sdk/server/kobo/KoboFormSdk'
import {customForms} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'

type Form = {
  id: string
  custom?: boolean
  url: string
  parsedName: KoboParsedFormName
  archived?: boolean
}

export const AppSidebar = () => {
  const ctx = useDatabaseContext()
  const {m} = useI18n()
  const t = useTheme()

  const parsedFormNames: Record<string, Seq<Form>> = useMemo(() => {
    const mapped: Record<string, Form[]> = {
      forms:
        ctx.formsAccessible?.map(_ => ({
          ..._,
          id: _.id,
          url: databaseIndex.siteMap.home(_.id),
          archived: _.deploymentStatus === 'archived',
          parsedName: KoboFormSdk.parseFormName(_.name),
        })) ?? [],
      custom: customForms
        .filter(c => ctx.formsAccessible?.some(_ => _.id === c.forms[0]?.id))
        .map(_ => ({
          url: databaseIndex.siteMap.custom(_.id),
          id: _.id,
          custom: true,
          archived: _.forms.every(fa => {
            const form = ctx.formsAccessible?.find(fa => fa.id === _.id)
            return !form || form.deploymentStatus === 'archived'
          }),
          parsedName: KoboFormSdk.parseFormName(_.name),
        })),
    }
    const grouped = seq([...mapped.forms, ...mapped.custom]).groupBy(
      _ => _.parsedName.program?.toUpperCase() ?? m.others,
    )
    return new Obj(grouped)
      .map((k, v) => [k, v.sort((a, b) => a.parsedName.name.localeCompare(b.parsedName.name))])
      .sort(([ak], [bk]) => ak.localeCompare(bk))
      .get()
  }, [ctx.formsAccessible])

  return (
    <Sidebar headerId="app-header">
      <NavLink to={databaseIndex.siteMap.importKoboForm}>
        {({isActive, isPending}) => (
          <SidebarItem icon="add" active={isActive}>
            {m.importFromKobo}
          </SidebarItem>
        )}
      </NavLink>
      <NavLink to={databaseIndex.siteMap.index}>
        {({isActive, isPending}) => <SidebarItem icon="home">{m.forms}</SidebarItem>}
      </NavLink>
      {ctx._forms.loading ? (
        <>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
        </>
      ) : ctx.formsAccessible?.length === 0 ? (
        <Fender
          type="empty"
          size="small"
          title={m._koboDatabase.noAccessToForm}
          sx={{mt: 2, color: t.palette.text.disabled}}
        />
      ) : (
        Obj.entries(parsedFormNames)?.map(([category, forms]) => (
          <SidebarSection dense title={category} key={category}>
            {forms.map((_: Form) => (
              <Tooltip key={_.id} title={_.parsedName.name} placement="right-end">
                <NavLink to={_.url}>
                  {({isActive, isPending}) => (
                    <SidebarItem
                      size={forms.length > 30 ? 'tiny' : 'small'}
                      sx={{height: 26}}
                      onClick={() => undefined}
                      key={_.id}
                      active={isActive}
                      iconEnd={
                        <>
                          {_.custom && (
                            <Icon
                              fontSize="small"
                              sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle'}}
                            >
                              device_hub
                            </Icon>
                          )}
                          {_.archived && (
                            <Icon
                              fontSize="small"
                              color="disabled"
                              sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle'}}
                            >
                              archive
                            </Icon>
                          )}
                        </>
                      }
                    >
                      <Txt sx={{color: _.archived ? t.palette.text.disabled : undefined}}>
                        {_.parsedName.name}
                        {_.custom && <span style={{fontWeight: 300}}> ({m._koboDatabase.mergedDb})</span>}
                      </Txt>
                    </SidebarItem>
                  )}
                </NavLink>
              </Tooltip>
            ))}
          </SidebarSection>
        ))
      )}
    </Sidebar>
  )
}
