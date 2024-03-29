import {Page} from '@/shared/Page'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useMetaContext} from '@/features/Meta/MetaContext'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {DrcProject, IKoboMeta, KoboIndex, KoboMetaStatus, koboMetaStatusLabel} from '@infoportal-common'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {IpIconBtn} from '@/shared/IconBtn'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import React, {useMemo} from 'react'
import {OptionLabelTypeCompact} from '@/shared/customInput/SelectStatus'
import {useSession} from '@/core/Session/SessionContext'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'

type Data = IKoboMeta & {
  duplicatedPhone?: number
  duplicatedTax?: number
}

export const MetaTable = () => {
  const ctx = useMetaContext()
  const {session} = useSession()
  const {m, formatDate, formatDateTime} = useI18n()

  const mappedData: Data[] = useMemo(() => {
    const source = ctx.data.uniqueData.filter(_ => _.status !== KoboMetaStatus.Rejected)
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
        type: 'string',
        id: 'id',
        head: m.koboId,
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
        id: 'formId',
        type: 'select_one',
        head: m.koboForm,
        renderQuick: _ => KoboIndex.searchById(_.formId)?.translation ?? _.formId,
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
        options: () => DatatableUtils.buildOptionByEnum(DrcProject),
        renderQuick: _ => _.project ?? [],
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
        type: 'string',
        id: 'taxId',
        head: m.taxID,
        renderQuick: _ => _.taxId,
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
    ]
    return x
  }, [session, mappedData])

  return (
    <Page width="full">
      <Panel>
        <Datatable
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