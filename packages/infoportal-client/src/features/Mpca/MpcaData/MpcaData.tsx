import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {useMpcaContext} from '../MpcaContext'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Bn_re, DrcOffice, KoboIndex, koboMetaStatusLabel, KoboXmlMapper, MpcaEntity} from 'infoportal-common'
import {IpBtn} from '@/shared/Btn'
import {formatDateTime, formatLargeNumber} from '@/core/i18n/localization/en'
import {MpcaHelper} from '@/core/sdk/server/mpca/MpcaEntity'
import {SelectDrcProject} from '@/shared/customInput/SelectDrcProject'
import {Box, Icon} from '@mui/material'
import {useAsync} from '@/shared/hook/useAsync'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DeduplicationStatusIcon} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {TableImg} from '@/shared/TableImg/TableImg'
import {StateStatusIcon} from '@/shared/customInput/SelectStatus'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseIndex} from '@/features/Database/databaseIndex'
import Link from 'next/link'
import {Txt} from '@/shared/Txt'
import {useSession} from '@/core/Session/SessionContext'
import {AccessSdk} from '@/core/sdk/server/access/AccessSdk'
import {fnSwitch, seq} from '@alexandreannic/ts-utils'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {useMemoFn} from '@alexandreannic/react-hooks-lib'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

const PrivateCell = () => {
  return <TableIcon color="disabled">lock</TableIcon>
}

export const MpcaData = () => {
  const {m, formatDate} = useI18n()
  const {api, conf} = useAppSettings()
  const {session, accesses} = useSession()
  const ctx = useMpcaContext()
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    ctx.fetcherData.fetch({force: false})
  }, [])

  const index = useMemoFn(ctx.data, (d) =>
    d.groupByAndApply(
      (_) => _.taxId!,
      (d) => d.length,
    ),
  )

  const officesAccesses = useMemo(() => {
    const bnreAccesses = accesses
      .filter(AccessSdk.filterByFeature(AppFeatureId.kobo_database))
      .find((_) => _.params?.koboFormId === KoboIndex.byName('bn_re').id)
    const offices = bnreAccesses?.params?.filters?.back_office as Bn_re.T['back_office'][] | undefined
    return new Set(
      seq(offices ?? [])
        .map(KoboXmlMapper.office)
        .compact(),
    )
  }, [accesses])

  const canSee = useCallback(
    (office?: DrcOffice) => {
      return session.admin || (office && officesAccesses.has(office))
    },
    [officesAccesses],
  )

  return (
    <Page width="full">
      <Panel sx={{overflow: 'visible'}}>
        <Datatable<MpcaEntity>
          id="mpca"
          title={m.data}
          showExportBtn
          // header={<PanelTitle>{m.data}</PanelTitle>}
          loading={ctx.fetcherData.loading}
          getRenderRowKey={(_) => '' + _.id}
          data={ctx.data}
          select={{
            getId: (_) => _.id,
            onSelect: (_) => setSelected(_),
            selectActions: (
              <>
                <SelectDrcProject
                  sx={{width: 140, mr: 1}}
                  options={MpcaHelper.projects}
                  onChange={(p) => {
                    ctx.asyncUpdates.call({
                      answerIds: selected,
                      key: 'projects',
                      value: p ? [p] : null,
                    })
                  }}
                />
                {/*<FormControlLabel*/}
                {/*  sx={{pl: .5, pr: 1.5, py: .5, ml: 0, mr: 1, border: t => '1px solid ' + t.palette.divider, borderRadius: 100}}*/}
                {/*  label={m.mpca.commit}*/}
                {/*  control={*/}
                {/*    <Switch size="small" onChange={(p, checked) => {*/}
                {/*      ctx.asyncUpdates.call({*/}
                {/*        answerIds: selected,*/}
                {/*        key: 'committed',*/}
                {/*        value: checked ? new Date() : undefined,*/}
                {/*      })*/}
                {/*    }}/>*/}

                {/*  }*/}
                {/*/>*/}
                {/*<AaSelectSingle*/}
                {/*  label={m.mpca.committed}*/}
                {/*  sx={{width: 140, mr: 1}}*/}
                {/*  options={[*/}
                {/*    {value: new Date() as any, children: 'Committed'},*/}
                {/*  ]}*/}
                {/*  onChange={p => {*/}
                {/*    ctx.asyncUpdates.call({*/}
                {/*      answerIds: selected,*/}
                {/*      key: 'committed',*/}
                {/*      value: p,*/}
                {/*    })*/}
                {/*  }}*/}
                {/*/>*/}
                <Box sx={{borderLeft: (t) => '1px solid ' + t.palette.divider, height: 30, ml: 1, mr: 2}} />
                <IpBtn disabled sx={{mr: 1}} color="primary" icon="content_paste_search" variant="outlined">
                  {m.mpca.generateDeduplicationFile}
                </IpBtn>
              </>
            ),
          }}
          columns={[
            {
              type: 'select_one',
              id: 'status',
              head: m.status,
              width: 0,
              align: 'center',
              render: (_) => {
                return {
                  label: <StateStatusIcon type={koboMetaStatusLabel[_.status!]} />,
                  value: _.status,
                  option: _.status,
                }
              },
            },
            {
              type: 'date',
              id: 'paidon',
              head: m.paidOn,
              render: (_) => {
                return {
                  label: formatDateTime(_.lastStatusUpdate),
                  tooltip: formatDate(_.lastStatusUpdate),
                  value: _.lastStatusUpdate,
                }
              },
            },
            {
              id: 'id',
              head: m.koboId,
              typeIcon: <DatatableHeadIconByType type="id" />,
              className: 'td-id',
              type: 'id',
              renderQuick: (_) => _.koboId,
            },
            {
              id: 'source',
              head: m.form,
              type: 'select_one',
              render: (_) => {
                const f = KoboIndex.searchById(_.formId)
                if (!f)
                  return {
                    value: undefined,
                    label: '',
                  }
                return {
                  value: f.translation,
                  option: f.translation,
                  label: (
                    <Link
                      target="_blank"
                      href={conf.linkToFeature(
                        AppFeatureId.kobo_database,
                        databaseIndex.siteMap.database.absolute(f.id),
                      )}
                    >
                      <Txt link>{f.translation}</Txt>
                      <Icon fontSize="inherit" color="primary" style={{marginLeft: 2, verticalAlign: 'middle'}}>
                        open_in_new
                      </Icon>
                    </Link>
                  ),
                }
              },
            },
            {
              id: 'program',
              head: m.program,
              type: 'select_one',
              renderQuick: (_) => _.activity,
            },
            {
              id: 'date',
              head: m.date,
              type: 'date',
              render: (_) => {
                return {
                  label: formatDate(_.date),
                  value: _.date,
                }
              },
            },
            {
              id: 'office',
              head: m.office,
              type: 'select_one',
              renderQuick: (_) => _.office,
            },
            {
              id: 'deduplication',
              align: 'center',
              width: 0,
              head: m.deduplication,
              type: 'select_one',
              // options: () => DatatableUtils.buildOptions(Obj.keys(WfpDeduplicationStatus), true),
              render: (_) => {
                return {
                  tooltip: _.deduplication && m.mpca.status[_.deduplication.status],
                  value: _.deduplication?.status,
                  option: _.deduplication?.status,
                  label: _.deduplication && <DeduplicationStatusIcon status={_.deduplication.status} />,
                }
              },
            },
            {
              id: 'amountUahSupposed',
              align: 'right',
              head: m.amountUAH,
              type: 'number',
              render: (_) => {
                return {
                  value: _.amountUahSupposed,
                  label: _.amountUahSupposed ? formatLargeNumber(_.amountUahSupposed) : undefined,
                }
              },
            },
            {
              id: 'amountUahDedup',
              align: 'right',
              head: 'Amount dedup',
              type: 'number',
              render: (_) => {
                return {
                  value: _.amountUahDedup,
                  label: _.amountUahDedup ? formatLargeNumber(_.amountUahDedup) : undefined,
                }
              },
            },
            // {
            //   id: 'suggestion',
            //   head: m.suggestion,
            //   type: 'select_one',
            //   // options: () => DatatableUtils.buildOptions(Obj.keys(DrcSupportSuggestion), true),
            //   renderQuick: _ => _.deduplication?.suggestion,
            // },            // {
            // //   id: 'deduplicationFile',
            // //   head: 'deduplicationFile',
            // //   type: 'select_one',
            // //   options: () => getAllPossibleValues('deduplicationFile').map(_ => ({value: _, label: _})),
            // //   render: _ => <Txt skeleton={50}/>
            // // },
            // // {
            // //   id: 'duplication',
            // //   type: 'select_one',
            // //   head: m.status,
            // //   options: () => Obj.keys(DeduplicationStatus).map(_ => ({value: _, label: _})),
            // //   align: 'center',
            // //   render: _ => fnSwitch(_.duplication!, {
            // //     duplicate: <TableIcon color="warning" children="content_copy"/>,
            // //     no_duplicate: <TableIcon color="success" children="check_circle"/>,
            // //     pending: <TableIcon color="disabled" children="schedule"/>,
            // //   }, () => <Txt skeleton={30}/>)
            // // },
            {
              id: 'amountUahFinal',
              align: 'right',
              head: 'Amount final',
              type: 'number',
              render: (_) => {
                return {
                  value: _.amountUahFinal,
                  label: _.amountUahFinal ? formatLargeNumber(_.amountUahFinal) : undefined,
                }
              },
            },
            {
              type: 'string',
              id: 'taxId',
              head: m.taxID,
              render: (_) => {
                return canSee(_.office)
                  ? {
                      label: _.taxId,
                      value: _.taxId,
                    }
                  : {
                      label: <PrivateCell />,
                      value: undefined,
                    }
              },
            },
            {
              type: 'number',
              id: m.taxIdOccurrences,
              head: m.taxIdOccurrences,
              renderQuick: (_) => index?.[_.taxId!],
            },
            {
              id: 'taxIdImg',
              align: 'center',
              width: 0,
              head: m.taxID,
              type: 'string',
              render: (_) => {
                if (!canSee(_.office))
                  return {
                    label: <PrivateCell />,
                    value: undefined,
                  }
                if (!_.taxIdFileId) return {value: undefined, label: ''}
                const url = KoboApiSdk.getAttachementUrl({
                  baseUrl: conf.apiURL,
                  formId: _.formId,
                  attachmentId: _.taxIdFileId,
                  answerId: _.koboId,
                })
                return {
                  export: url,
                  value: _.taxIdFileName,
                  label: <TableImg tooltipSize={650} url={url} />,
                }
              },
            },
            {
              id: 'donor',
              head: m.donor,
              type: 'select_multiple',
              options: () =>
                DatatableUtils.buildOptions(ctx.data?.flatMap((_) => _.donor!).distinct((_) => _) ?? [], true),
              renderQuick: (_) => _.donor,
            },
            {
              id: 'project',
              head: m.project,
              type: 'select_multiple',
              width: 160,
              options: () =>
                DatatableUtils.buildOptions(ctx.data?.flatMap((_) => _.project!).distinct((_) => _) ?? [], true),
              renderQuick: (_) => _.project,
            },
            {
              id: 'prog',
              head: m.program,
              type: 'select_one',
              renderQuick: (_) => _.activity,
            },
            {
              id: 'oblast',
              head: m.oblast,
              type: 'select_one',
              renderQuick: (_) => _.oblast,
            },
            {
              id: 'hromada',
              head: m.hromada,
              type: 'select_one',
              renderQuick: (_) => _.hromada,
            },
            {
              id: 'raion',
              head: m.raion,
              type: 'select_one',
              renderQuick: (_) => _.raion,
            },
            {
              id: 'enumerator',
              head: m.enumerator,
              type: 'string',
              // options: () => DatatableUtils.buildOptions(Obj.values(DrcOffice), true),
              renderQuick: (_) => _.enumerator,
            },
            {
              id: 'hhSize',
              head: m.hhSize,
              type: 'number',
              renderQuick: (_) => _.personsCount,
            },
            {
              type: 'string',
              id: 'passportNum',
              head: m.passportNumber,
              render: (_) =>
                canSee(_.office)
                  ? {
                      label: _.passportNum,
                      value: _.passportNum,
                    }
                  : {
                      label: <PrivateCell />,
                      value: undefined,
                    },
            },
            {
              id: 'idFileImg',
              align: 'center',
              width: 0,
              head: m.id,
              type: 'string',
              render: (_) => {
                if (!canSee(_.office))
                  return {
                    label: <PrivateCell />,
                    value: undefined,
                  }
                if (!_.idFileId) return {value: undefined, label: ''}
                const url = KoboApiSdk.getAttachementUrl({
                  baseUrl: conf.apiURL,
                  formId: _.formId,
                  attachmentId: _.idFileId,
                  answerId: _.koboId,
                })
                return {
                  export: url,
                  value: _.idFileName,
                  label: <TableImg tooltipSize={650} url={url} />,
                }
              },
            },
            {type: 'string', id: 'lastName', head: m.lastName, renderQuick: (_) => _.lastName},
            {type: 'string', id: 'firstName', head: m.firstName, renderQuick: (_) => _.firstName},
            {type: 'string', id: 'patronyme', head: m.patronyme, renderQuick: (_) => _.patronymicName},
            {
              id: 'phone',
              type: 'string',
              head: m.phone,
              render: (_) =>
                canSee(_.office)
                  ? {
                      label: _.phone,
                      value: _.phone,
                    }
                  : {
                      label: <PrivateCell />,
                      value: undefined,
                    },
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
