import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {DrcOffice, WfpDeduplicationStatus} from 'infoportal-common'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {Txt} from '@/shared/Txt'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {format} from 'date-fns'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Datatable} from '@/shared/Datatable/Datatable'

export const DeduplicationStatusIcon = ({status}: {status: WfpDeduplicationStatus}) => {
  return fnSwitch(
    status,
    {
      Deduplicated: <TableIcon color="warning" children="join_full" />,
      PartiallyDeduplicated: <TableIcon color="info" children="join_left" />,
      NotDeduplicated: <TableIcon color="success" children="check_circle" />,
      Error: <TableIcon color="error" children="error" />,
    },
    () => <></>,
  )
}

export const WfpDeduplicationData = () => {
  const {api} = useAppSettings()
  const _search = useFetcher(api.wfpDeduplication.search)
  const {formatDate, formatDateTime, formatLargeNumber} = useI18n()
  const {m} = useI18n()

  const {existingOrga, taxIdCounter} = useMemo(() => {
    if (!_search.get) return {}
    const data = seq(_search.get.data)
    return {
      taxIdCounter: data.groupByAndApply(
        (_) => _.taxId ?? '',
        (_) => _.length,
      ),
      existingOrga: data
        .map((_) => _.existingOrga)
        .distinct((_) => _)
        .compact()
        .map(DatatableUtils.buildOption),
    }
  }, [_search.get])

  useEffect(() => {
    _search.fetch()
  }, [])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          id="wfp"
          showExportBtn
          title={'wfp-deduplication-' + format(new Date(), 'yyyy-MM-dd')}
          loading={_search.loading}
          columns={[
            {
              id: 'fileName',
              head: m.fileName,
              renderQuick: (_) => _.fileName,
              type: 'string',
            },
            {
              id: 'createdAt',
              head: m.createdAt,
              render: (_) => {
                return {
                  label: formatDate(_.createdAt),
                  value: _.createdAt,
                  tooltip: formatDateTime(_.createdAt),
                }
              },
              type: 'date',
            },
            {
              id: 'office',
              head: m.office,
              renderQuick: (_) => _.office,
              type: 'select_one',
              options: () => Obj.values(DrcOffice).map((_) => ({label: _, value: _})),
            },
            {
              type: 'select_one',
              id: 'category',
              head: m.category,
              renderQuick: (_) => _.category,
            },
            // {
            //   id: 'beneficiaryId',
            //   head: 'beneficiaryId',
            //   render: _ => _.beneficiaryId, type: 'string'
            // },
            {
              id: 'taxId',
              head: m.taxID,
              type: 'string',
              render: (_) => {
                return {
                  value: _.taxId,
                  label: _.taxId ?? <Txt color="error">{m.mpca.uploadWfpTaxIdMapping}</Txt>,
                }
              },
            },
            {
              id: 'taxIdOccurrences',
              head: m.taxIdOccurrences,
              type: 'number',
              renderQuick: (_) => taxIdCounter?.[_.taxId!] ?? 0,
            },
            {
              id: 'amount',
              type: 'number',
              head: m.amount,
              align: 'right',
              render: (_) => {
                return {
                  label: formatLargeNumber(_.amount),
                  value: _.amount,
                }
              },
            },
            {
              id: 'validFrom',
              head: m.validFrom,
              type: 'date',
              render: (_) => {
                return {
                  label: formatDate(_.validFrom),
                  value: _.validFrom,
                }
              },
            },
            {
              id: 'expiry',
              head: m.expiry,
              type: 'date',
              render: (_) => {
                return {
                  label: formatDate(_.expiry),
                  value: _.expiry,
                }
              },
            },
            {
              id: 'suggestion',
              head: m.suggestion,
              renderQuick: (_) => m.mpca.drcSupportSuggestion[_.suggestion],
              width: 246,
              type: 'select_one',
              // options: () => Obj.keys(DrcSupportSuggestion).map(_ => ({label: m.mpca.drcSupportSuggestion[_], value: _})),
            },
            {
              id: 'suggestionDuration',
              head: m.mpca.suggestionDurationInMonths,
              type: 'number',
              render: (_) => {
                return {
                  value: _.suggestionDurationInMonths,
                  label: _.suggestionDurationInMonths + ' ' + m.months,
                }
              },
            },
            {
              id: 'status',
              align: 'center',
              head: m.status,
              width: 0,
              type: 'select_one',
              options: () => DatatableUtils.buildOptions(Obj.keys(WfpDeduplicationStatus), true),
              render: (_) => {
                return {
                  tooltip: m.mpca.status[_.status],
                  label: <DeduplicationStatusIcon status={_.status} />,
                  value: _.status ?? DatatableUtils.blank,
                }
              },
            },
            {
              id: 'existingOrga',
              head: m.mpca.existingOrga,
              renderQuick: (_) => _.existingOrga,
              options: existingOrga ? () => existingOrga : undefined,
              type: 'select_one',
            },
            {
              id: 'existingAmount',
              head: m.mpca.existingAmount,
              render: (_) => {
                return {
                  label: _.existingAmount && formatLargeNumber(_.existingAmount),
                  value: _.existingAmount,
                }
              },
              type: 'number',
            },
            {
              id: 'existingStart',
              head: m.mpca.existingStart,
              render: (_) => {
                return {
                  label: _.existingStart && formatDate(_.existingStart),
                  value: _.existingStart,
                }
              },
              type: 'date',
            },
            {
              id: 'existingEnd',
              head: m.mpca.existingEnd,
              render: (_) => {
                return {
                  label: _.existingEnd && formatDate(_.existingEnd),
                  value: _.existingEnd,
                }
              },
              type: 'date',
            },
          ]}
          data={_search.get?.data}
        />
      </Panel>
    </Page>
  )
}
