import {Enum, fnSwitch, map, Obj, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {Lazy} from '@/shared/Lazy'
import {differenceInDays, format, subDays} from 'date-fns'
import {ChartLine} from '@/shared/charts/ChartLine'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {useSession} from '@/core/Session/SessionContext'
import {MinusRusChartPanel} from '@/features/Safety/IncidentsDashboard/MinusRusChartPanel'
import {CommentsPanel, CommentsPanelProps} from '@/shared/CommentsPanel'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {Period, PeriodHelper, Safety_incident} from '@infoportal-common'
import {Dispatch, SetStateAction, useMemo, useState} from 'react'
import {InferTypedAnswer} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {SafetyIncidentDashboardAlert} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboardAlert'
import {Panel, PanelBody, PanelHead, PanelTitle} from '@/shared/Panel'
import {Divider} from '@mui/material'
import {IpSelectMultiple, IpSelectMultipleHelper} from '@/shared/Select/SelectMultiple'
import {protectionDashboardMonitoPreviousPeriodDeltaDays} from '@/features/Protection/DashboardMonito/useProtectionDashboardMonitoData'

export enum AlertType {
  green = 'green',
  blue = 'blue',
  yellow = 'yellow',
  red = 'red',
}

export const SafetyIncidentDashboardBody = ({
  period,
  data: {
    data,
    dataAlertFiltered,
    dataAlert,
    dataIncident,
    dataIncidentFiltered,
  },
  optionFilter,
  setOptionFilters,
}: {
  period: Partial<Period>
  data: {
    data: Seq<InferTypedAnswer<'safety_incident'>>
    dataAlert: Seq<InferTypedAnswer<'safety_incident'>>
    dataAlertFiltered: Seq<InferTypedAnswer<'safety_incident'>>
    dataIncident: Seq<InferTypedAnswer<'safety_incident'>>
    dataIncidentFiltered: Seq<InferTypedAnswer<'safety_incident'>>
  }
  optionFilter: Record<string, string[] | undefined>
  setOptionFilters: Dispatch<SetStateAction<Record<string, string[] | undefined>>>
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [mapType, setMapType] = useState<'incident' | 'attack'>('incident')
  const {session} = useSession()
  const [filterAttack, setFilterAttack] = useState<string[]>([])

  const dataIncidentWithAlertType = useMemo(() => {
    return dataIncidentFiltered.map(item => {
      const alertItem = dataAlertFiltered.find(alert => alert.id === item.id)
      const alertTypes: AlertType[] = []
      if (alertItem?.alert_green_num) alertTypes.push(AlertType.green)
      if (alertItem?.alert_blue_num) alertTypes.push(AlertType.blue)
      if (alertItem?.alert_yellow_num) alertTypes.push(AlertType.yellow)
      if (alertItem?.alert_red_num) alertTypes.push(AlertType.red)
      return {
        ...item,
        alertType: alertTypes,
      }
    })
  }, [dataIncidentFiltered, dataAlertFiltered])

  const finalFilteredData = useMemo(() => {
    return dataIncidentWithAlertType.filter(_ => {
      const matchesAttackType = filterAttack.length === 0 || _.attack_type?.some(x => filterAttack.includes(x))
      const matchesAlertType = optionFilter.alertType?.length === 0 || optionFilter.alertType?.some(alertType => _.alertType?.includes(alertType as AlertType))
      return matchesAttackType && matchesAlertType
    })
  }, [dataIncidentWithAlertType, filterAttack, optionFilter.alertType])

  const dataIncidentFilteredLastPeriod = useMemo(() => map(period.start, period.end, (start, end) => {
    const lastPeriod = {
      start: start,
      end: subDays(end, protectionDashboardMonitoPreviousPeriodDeltaDays)
    }
    if (differenceInDays(end, start) <= protectionDashboardMonitoPreviousPeriodDeltaDays) return
    return finalFilteredData.filter(_ => PeriodHelper.isDateIn(lastPeriod, _.date))
  }), [finalFilteredData])

  return (
    <Div sx={{alignItems: 'flex-start'}} responsive>
      <Div column>
        <Panel>
          <Div sx={{alignItems: 'stretch'}}>
          </Div>
          <PanelBody>
            <ChartPieWidgetBy
              title={m.safety.attacks}
              filter={_ => _.attack === 'yes'}
              showValue
              compare={dataIncidentFilteredLastPeriod ? {before: dataIncidentFilteredLastPeriod} : undefined}
              filterBase={_ => _.attack !== undefined}
              data={finalFilteredData}
            />
          </PanelBody>
          <Divider/>
          <PanelBody>
            <ScRadioGroup value={mapType} onChange={setMapType} dense inline sx={{mb: 2}}>
              <ScRadioGroupItem dense hideRadio value="incident" title={m.safety.incidents}/>
              <ScRadioGroupItem dense hideRadio value="attack" title={m.safety.attacks}/>
            </ScRadioGroup>
            {fnSwitch(mapType, {
              'incident': (
                <MapSvgByOblast
                  sx={{maxWidth: 480}}
                  fillBaseOn="value"
                  data={finalFilteredData}
                  getOblast={_ => _.oblastISO!}
                  value={_ => true}
                  base={_ => _.oblastISO !== undefined}
                />
              ),
              'attack': (
                <MapSvgByOblast
                  sx={{maxWidth: 480}}
                  fillBaseOn="value"
                  data={finalFilteredData}
                  getOblast={_ => _.oblastISO}
                  value={_ => _.attack === 'yes'}
                  base={_ => _.oblastISO !== undefined}
                />
              ),
            })}
          </PanelBody>
          <Divider/>
          <PanelBody>
            <PanelTitle sx={{mb: 1}}>{m.safety.attackTypes}</PanelTitle>
            <ChartBarMultipleBy
              data={finalFilteredData}
              by={_ => _.attack_type}
              label={Safety_incident.options.attack_type}
            />
          </PanelBody>
          <Divider/>
          <PanelBody>
            <PanelTitle sx={{mb: 1}}>{m.safety.target}</PanelTitle>
            <ChartBarMultipleBy
              data={finalFilteredData}
              by={_ => _.what_destroyed}
              label={Safety_incident.options.what_destroyed}
            />
          </PanelBody>
          <Divider/>
          <PanelBody>
            <PanelTitle sx={{mb: 1}}>{m.safety.typeOfCasualties}</PanelTitle>
            <ChartBarMultipleBy
              data={finalFilteredData}
              by={_ => _.type_casualties}
              label={Safety_incident.options.type_casualties}
            />
          </PanelBody>
          <Divider/>
          <PanelBody>
            <PanelTitle sx={{mb: 1}}>{m.safety.lastAttacks}</PanelTitle>
            <Lazy deps={[finalFilteredData]} fn={() => finalFilteredData?.filter(_ => _.attack === 'yes').map(_ => ({
              id: _.id,
              title: m.safety.attackOfOn(_.oblastISO, _.attack_type),
              date: _.date_time,
              desc: _.report_summary,
            }) as CommentsPanelProps['data'][0])}>
              {_ => <CommentsPanel pageSize={10} data={_}/>}
            </Lazy>
          </PanelBody>
        </Panel>
      </Div>
      <Div column>
        <SafetyIncidentDashboardAlert data={{
          data,
          dataAlert: dataAlertFiltered,
        }} optionFilter={optionFilter} setOptionFilters={setOptionFilters}/>
        <SlidePanel title={m.safety.casualties}>
          <Div sx={{mt: -2}}>
            <Lazy deps={[finalFilteredData]} fn={() => finalFilteredData?.sum(_ => _.dead ?? 0)}>
              {_ => (
                <SlideWidget sx={{minHeight: 'auto', flex: 1}} title={m.safety.dead}>
                  {formatLargeNumber(_)}
                </SlideWidget>
              )}
            </Lazy>
            <Lazy deps={[finalFilteredData]} fn={() => finalFilteredData?.sum(_ => _.injured ?? 0)}>
              {_ => (
                <SlideWidget sx={{minHeight: 'auto', flex: 1}} title={m.safety.injured}>
                  {formatLargeNumber(_)}
                </SlideWidget>
              )}
            </Lazy>
          </Div>
          <Lazy deps={[finalFilteredData]} fn={() => {
            const x = finalFilteredData?.groupBy(_ => _.date_time ? format(_.date_time, 'yyyy-MM') : 'no_date')
            return new Enum(x)
              .transform((k, v) => [k, {
                total: v.length,
                dead: v.sum(_ => _.dead ?? 0),
                injured: v.sum(_ => _.injured ?? 0),
              }])
              .sort(([bk], [ak]) => bk.localeCompare(ak))
              .entries()
              .filter(([k]) => k !== 'no_date')
              .map(([k, v]) => ({name: k, ...v}))
          }}>
            {_ => (
              <ChartLine height={200} data={_ as any} translation={{
                total: m.safety.incidents,
                dead: m.safety.dead,
                injured: m.safety.injured,
              } as any}/>
            )}
          </Lazy>
        </SlidePanel>
        {(session?.admin || session?.drcJob === 'Head of Safety') && (
          <MinusRusChartPanel/>
        )}
      </Div>
    </Div>
  )
}
