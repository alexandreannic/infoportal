import {useCallback, useEffect, useMemo, useState} from 'react'
import {useMemoFn} from '@alexandreannic/react-hooks-lib'
import {seq} from '@alexandreannic/ts-utils'
import {Icon} from '@mui/material'
import Link from 'next/link'

import {Bn_re, DrcOffice, KoboIndex, koboMetaStatusLabel, KoboXmlMapper, type IKoboMeta} from 'infoportal-common'

import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {AccessSdk} from '@/core/sdk/server/access/AccessSdk'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {Page} from '@/shared'
import {OptionLabelTypeCompact} from '@/shared/customInput/SelectStatus'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {Panel} from '@/shared/Panel'
import {TableImg} from '@/shared/TableImg/TableImg'
import {Txt} from '@/shared/Txt'

import {useEcrecContext} from './EcrecContext'

const PrivateCell = () => {
  return <TableIcon color="disabled">lock</TableIcon>
}

export const EcrecDataTable = () => {
  const {m, formatDate} = useI18n()
  const {conf} = useAppSettings()
  const {session, accesses} = useSession()
  const ctx = useEcrecContext()
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
        <Datatable<IKoboMeta>
          id="ecrec"
          title={m.data}
          showExportBtn
          loading={ctx.fetcherData.loading}
          getRenderRowKey={(_) => '' + _.id}
          data={ctx.data}
          columns={[
            {
              type: 'select_one',
              id: 'status',
              head: m.status,
              width: 0,
              align: 'center',
              render: (_) => {
                return {
                  label: <OptionLabelTypeCompact type={koboMetaStatusLabel[_.status!]} />,
                  value: _.status,
                  option: _.status,
                }
              },
            },
            {
              type: 'date',
              id: 'lastStatusUpdate',
              head: m.lastStatusUpdate,
              render: (_) => {
                return {
                  label: _.lastStatusUpdate ? formatDate(new Date(_.lastStatusUpdate)) : '',
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
              id: 'sector',
              head: m.sector,
              type: 'select_one',
              renderQuick: (_) => _.sector,
            },
            {
              id: 'activity',
              head: m.activity,
              type: 'select_one',
              renderQuick: (_) => _.activity,
            },
            {
              id: 'date',
              head: m.date,
              type: 'date',
              render: (_) => {
                return {
                  label: _.date ? formatDate(new Date(_.date)) : '',
                  value: _.date,
                }
              },
            },
            {
              id: 'updatedAt',
              head: m.updatedAt,
              type: 'date',
              render: (_) => {
                return {
                  label: _.updatedAt ? formatDate(new Date(_.updatedAt)) : '',
                  value: _.updatedAt,
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
              id: 'office',
              head: m.office,
              type: 'select_one',
              renderQuick: (_) => _.office,
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
              id: 'settlement',
              head: m.settlement,
              type: 'select_one',
              renderQuick: (_) => _.settlement,
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
