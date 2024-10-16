import {Page} from '@/shared/Page'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useMetaContext} from '@/app/meta/MetaContext'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {AILocationHelper, DrcProject, IKoboMeta, KoboIndex, koboIndex, KoboMetaStatus, koboMetaStatusLabel, PersonDetails} from 'infoportal-common'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {IpIconBtn} from '@/shared/IconBtn'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import React, {useEffect, useMemo} from 'react'
import {OptionLabelTypeCompact} from '@/shared/customInput/SelectStatus'
import {useSession} from '@/core/Session/SessionContext'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {TableImg} from '@/shared/TableImg/TableImg'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import Link from 'next/link'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {Txt} from '@/shared/Txt'
import {Icon, Skeleton} from '@mui/material'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpBtn} from '@/shared/Btn'
import {useFetcher} from '@/shared/hook/useFetcher'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'

type Data = IKoboMeta & {
  duplicatedPhone?: number
  duplicatedTax?: number
}

export default function MetaData() {
  const ctx = useMetaContext()
  const {session} = useSession()
  const {conf} = useAppSettings()
  const {m, formatDate, formatDateTime} = useI18n()
  const fetcherSettlement = useFetcher(() => AILocationHelper.settlements)

  useEffect(() => {
    fetcherSettlement.fetch()
  }, [])

  const mappedData: Data[] = useMemo(() => {
    const source = ctx.data.data.filter(_ => _.status !== KoboMetaStatus.Rejected)
    const byPhone = source.groupBy(_ => _.phone ?? '')
    const byTax = source.groupBy(_ => _.taxId ?? '')
    return ctx.data.data.map(_ => {
      return {
        ..._,
        duplicatedPhone: _.phone ? byPhone[_.phone]?.length : undefined,
        duplicatedTax: _.taxId ? byTax[_.taxId]?.length : undefined,
      }
    })
  }, [ctx.data.data])

  const columns = useMemo(() => {
    const x: DatatableColumn.Props<Data>[] = [
      {
        type: 'select_one',
        id: 'status',
        head: m.status,
        width: 0,
        align: 'center',
        render: _ => {
          return {
            label: <OptionLabelTypeCompact type={koboMetaStatusLabel[_.status!]}/>,
            value: _.status,
            option: _.status,
          }
        },
      },
      {
        type: 'id',
        id: 'id',
        head: m.koboId,
        typeIcon: <DatatableHeadIconByType type="id"/>,
        className: 'td-id',
        renderQuick: _ => _.koboId,
      },
      {
        type: 'date',
        id: 'date',
        head: m.date,
        render: _ => {
          return {
            value: _.date,
            label: formatDate(_.date),
            tooltip: formatDateTime(_.date),
          }
        }
      },
      {
        type: 'date',
        id: 'lastStatusUpdate',
        head: m.lastStatusUpdate,
        render: _ => {
          return {
            value: _.lastStatusUpdate,
            label: formatDate(_.lastStatusUpdate),
            tooltip: formatDateTime(_.lastStatusUpdate),
          }
        }
      },
      {
        id: 'formId',
        head: m.form,
        type: 'select_one',
        render: _ => {
          const f = KoboIndex.searchById(_.formId)
          if (!f) return {
            value: undefined,
            label: ''
          }
          return {
            value: f.translation,
            option: f.translation,
            label: (
              <Link target="_blank" href={conf.linkToFeature(
                AppFeatureId.kobo_database,
                databaseIndex.siteMap.database.absolute(koboIndex.drcUa.server.prod, f.id))
              }>
                <Txt link>{f.translation}</Txt>
                <Icon fontSize="inherit" color="primary" style={{marginLeft: 2, verticalAlign: 'middle'}}>open_in_new</Icon>
              </Link>
            )
          }
        }
      },
      {
        id: 'ofice',
        type: 'select_one',
        head: m.office,
        renderQuick: _ => _.office,
      },
      {
        id: 'oblast',
        type: 'select_one',
        head: m.oblast,
        renderQuick: _ => _.oblast,
      },
      {
        id: 'sector',
        type: 'select_one',
        head: m.sector,
        renderQuick: _ => _.sector,
      },
      {
        id: 'activity',
        type: 'select_one',
        head: m.activity,
        renderQuick: _ => _.activity,
      },
      {
        id: 'project',
        type: 'select_multiple',
        head: m.project,
        options: () => [...DatatableUtils.buildOptionByEnum(DrcProject), DatatableUtils.blankOption],
        renderQuick: _ => _.project,
      },
      {
        id: 'raion',
        type: 'select_one',
        head: m.raion,
        renderQuick: _ => _.raion,
      },
      {
        id: 'hromada',
        type: 'select_one',
        head: m.hromada,
        renderQuick: _ => _.hromada,
      },
      {
        id: 'settlement',
        type: 'select_one',
        head: m.settlement,
        render: _ => {
          const value = fetcherSettlement.get ? fetcherSettlement.get[_.settlement!]?.en : _.settlement
          return {
            label: fetcherSettlement.loading ? <Skeleton/> : value,
            value,
          }
        },
      },
      {
        type: 'string',
        id: 'taxId',
        head: m.taxID,
        renderQuick: _ => _.taxId,
      },
      {
        id: 'taxIdImg',
        align: 'center',
        head: m.taxIdPhoto,
        type: 'string',
        render: _ => {
          return {
            label: _.taxIdFileUrl && <TableImg tooltipSize={650} url={getKoboImagePath(_.taxIdFileUrl)}/>,
            export: _.taxIdFileUrl,
            value: _.taxIdFileName,
          }
        },
      },
      {
        type: 'string',
        id: 'passport',
        head: m.passportNumber,
        renderQuick: _ => _.passportNum,
      },
      {
        id: 'idImg',
        align: 'center',
        head: m.idPhoto,
        type: 'string',
        render: _ => {
          return {
            label: _.idFileUrl && <TableImg tooltipSize={650} url={getKoboImagePath(_.idFileUrl)}/>,
            export: _.idFileUrl,
            value: _.idFileName,
          }
        },
      },
      {
        type: 'number',
        id: 'duplicatedTax',
        head: m.taxIdOccurrences,
        renderQuick: _ => _.duplicatedTax,
      },
      {
        type: 'string',
        id: 'phone',
        head: m.phone,
        renderQuick: _ => _.phone ? session.admin ? _.phone : '*******' + _.phone.substring(_.phone.length - 3) : undefined,
      },
      {
        type: 'number',
        id: 'duplicatedPhone',
        head: m.phoneOccurrences,
        renderQuick: _ => _.duplicatedPhone,
      },
      ...session.admin ? [{
        type: 'select_one',
        id: 'enumerator',
        head: m.enumerator,
        renderQuick: _ => _.enumerator,
      } as DatatableColumn.Props<Data>] : [],
      {
        type: 'number',
        id: 'individuals',
        head: m.individuals,
        renderQuick: _ => _.personsCount,
      },
      {
        type: 'number',
        id: 'individuals-details',
        head: m.individuals,
        render: _ => {
          return {
            label: (
              <PopoverWrapper
                content={close => _.persons ? (
                  <Datatable<PersonDetails>
                    header={<IpIconBtn style={{marginLeft: 'auto'}} onClick={close}>close</IpIconBtn>}
                    hideColumnsToggle
                    hidePagination
                    defaultLimit={200}
                    id="meta-table-persons"
                    data={_.persons}
                    columns={[
                      {type: 'number', id: 'age', head: m.age, renderQuick: _ => _.age},
                      {type: 'select_one', id: 'gender', head: m.gender, renderQuick: _ => _.gender},
                      {width: 120, type: 'select_one', id: 'displacement', head: m.displacementStatus, renderQuick: _ => _.displacement},
                      {width: 220, type: 'select_one', id: 'disability', head: m.disability, renderQuick: _ => _.disability?.map(d => m.disability_[d]).join(', ')},
                    ]}
                  />
                ) : undefined}>
                <IpBtn>{_.persons?.length ?? 0}</IpBtn>
              </PopoverWrapper>
            ),
            value: _.persons?.length ?? 0,
          }
        },
      },
    ]
    return x
  }, [session, mappedData])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          showExportBtn
          header={props => (
            <PopoverWrapper
              popoverProps={{
                slotProps: {
                  paper: {
                    sx: {minWidth: 510}
                  }
                }
              }}
              content={() => (
                <AgeGroupTable
                  tableId="useCustomHeader"
                  enableDisplacementStatusFilter
                  enablePwdFilter
                  persons={props.filteredData.flatMap(_ => _.persons ?? [])}
                  sx={{p: 1}}
                />
              )}
            >
              <IpIconBtn children="group"/>
            </PopoverWrapper>
          )}
          id="meta"
          data={mappedData}
          columns={columns}
        />
      </Panel>
    </Page>
  )

}