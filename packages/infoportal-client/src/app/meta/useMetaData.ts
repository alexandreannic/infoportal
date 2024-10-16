import {useCallback, useMemo, useState} from 'react'
import {Obj, Seq} from '@alexandreannic/ts-utils'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {appConfig} from '@/conf/AppConfig'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {drcOffices, IKoboMeta, KoboIndex, KoboMetaStatus, OblastIndex, Period, PeriodHelper} from 'infoportal-common'
import {useI18n} from '@/core/i18n'

export type DistinctBy = 'taxId' | 'phone' | 'submission'
export type MetaDashboardCustomFilter = {
  distinctBy?: ('taxId' | 'phone' | 'submission')[]
}

export const distinctBys = <T extends Record<string, any>, K extends keyof T, >(data: Seq<T>, params: Record<K, boolean>): Seq<T> => {
  const keys = Obj.keys(params).filter(k => params[k])
  if (keys.length === 0) return data
  const alreadyMet = new Map<string, Set<string>>(keys.map(_ => [_, new Set()]))
  return data.filter(row => {
    return keys.every(key => {
      if (!row[key]) return true
      if (alreadyMet.get(key)!.has(row[key])) return false
      alreadyMet.get(key)!.add(row[key])
      return true
    })
  })
}

export type UseMetaData = ReturnType<typeof useMetaDashboardData>

export const useMetaDashboardData = ({data, storageKeyPrefix}: {storageKeyPrefix?: string, data: Seq<IKoboMeta>}) => {
  const {m} = useI18n()
  const [periodCommit, setPeriodCommit] = useState<Partial<Period>>({})
  const [period, setPeriod] = useState<Partial<Period>>({})

  const shape = useMemo(() => {
    return DataFilter.makeShape<IKoboMeta>({
      status: {
        icon: 'check_circle',
        label: m.status,
        getValue: _ => _.status ?? DataFilter.blank,
        addBlankOption: true,
        getOptions: () => DataFilter.buildOptionsFromObject(KoboMetaStatus),
      },
      sector: {
        icon: 'category',
        label: m.sector,
        getValue: _ => _.sector,
        getOptions: () => DataFilter.buildOptions(data.flatMap(_ => _.sector!).distinct(_ => _).sort()),
      },
      activity: {
        icon: appConfig.icons.program,
        label: m.program,
        getValue: _ => _.activity,
        getOptions: (get) => DataFilter.buildOptions(get().flatMap(_ => _.activity!).distinct(_ => _).sort()),
      },
      office: {
        icon: appConfig.icons.office,
        label: m.office,
        getValue: _ => _.office,
        getOptions: () => DataFilter.buildOptions(drcOffices)
      },
      project: {
        multiple: true,
        icon: appConfig.icons.project,
        label: m.project,
        getValue: _ => _.project ?? DataFilter.blank,
        getOptions: () => DataFilter.buildOptions(data.flatMap(_ => _.project!).distinct(_ => _).sort(), true),
      },
      form: {
        icon: appConfig.icons.koboForm,
        label: m.koboForms,
        getValue: _ => _.formId,
        getOptions: () => data.map(_ => _.formId!).distinct(_ => _).sort().map(_ => DataFilter.buildOption(_, KoboIndex.searchById(_)?.translation ?? _))
      },
      oblast: {
        icon: appConfig.icons.oblast,
        label: m.oblast,
        getValue: _ => _.oblast,
        getOptions: () => DataFilter.buildOptions(OblastIndex.names),
      },
      raion: {
        label: m.raion,
        getValue: _ => _.raion,
        getOptions: (get) => get().map(_ => _.raion).compact()
          .distinct(_ => _)
          .sort().map(_ => ({value: _, label: _}))
      },
      hromada: {
        label: m.hromada,
        getValue: _ => _.hromada,
        getOptions: (get) => get()
          .map(_ => _.hromada)
          .compact()
          .distinct(_ => _)
          .sort()
          .map(_ => ({value: _, label: _}))
      },
    })
  }, [data])
  const [shapeFilters, setShapeFilters] = usePersistentState<DataFilter.InferShape<typeof shape>>({}, {storageKey: storageKeyPrefix + 'meta-dashboard-filters'})
  const [customFilters, setCustomFilters] = usePersistentState<MetaDashboardCustomFilter>({}, {storageKey: storageKeyPrefix + 'meta-dashboard-custom-filters'})
  const distinctBy = useMemo(() => new Set(customFilters.distinctBy), [customFilters.distinctBy])

  const filteredData = useMemo(() => {
    const filteredBy_date = data.filter(d => {
      try {
        const isDateIn = PeriodHelper.isDateIn(period, d.date)
        if (!isDateIn) return false
        const isDateCommitIn = (!periodCommit.start && !periodCommit.end)
          || PeriodHelper.isDateIn(periodCommit, d.lastStatusUpdate) && d.status === KoboMetaStatus.Committed
        if (!isDateCommitIn) return false
        return true
      } catch (e) {
        console.log(e, d)
      }
    })
    const filteredByShape = DataFilter.filterData(filteredBy_date, shape, shapeFilters)
    return distinctBys(filteredByShape, {
      taxId: distinctBy.has('taxId'),
      phone: distinctBy.has('phone'),
    })
  }, [data, shapeFilters, period, shape, customFilters])

  const filteredUniqueData = useMemo(() => filteredData.distinct(_ => _.koboId), [filteredData])
  const filteredPersons = useMemo(() => filteredData.flatMap(_ => _.persons ?? []), [filteredData])
  const filteredUniquePersons = useMemo(() => filteredUniqueData.flatMap(_ => _.persons ?? []), [filteredData])

  const clearAllFilter = useCallback(() => {
    setShapeFilters({})
    setCustomFilters({})
    setPeriod({})
    setPeriodCommit({})
    setCustomFilters({})
  }, [])

  return {
    shape,
    period,
    setPeriod,
    periodCommit,
    setPeriodCommit,
    shapeFilters,
    setShapeFilters,
    customFilters,
    setCustomFilters,
    distinctBy,
    setDistinctBy: (key: DistinctBy, value: boolean) => {
      setCustomFilters(d => {
        return {
          ...d,
          distinctBy: value
            ? d.distinctBy?.includes(key)
              ? d.distinctBy
              : [...d.distinctBy ?? [], key]
            : d.distinctBy?.filter(_ => key !== _)
        }
      })
    },
    clearAllFilter,
    data,
    filteredData: distinctBy.has('submission') ? filteredUniqueData : filteredData,
    filteredPersons: distinctBy.has('submission') ? filteredUniquePersons : filteredPersons,
    filteredUniqueData,
    filteredUniquePersons,
  }
}