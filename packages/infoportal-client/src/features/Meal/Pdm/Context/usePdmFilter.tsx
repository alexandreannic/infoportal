import {useMemo, useState} from 'react'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {useI18n} from '@/core/i18n'
import {PdmData, PdmForm} from '@/features/Meal/Pdm/Context/MealPdmContext'
import {Seq, seq} from '@alexandreannic/ts-utils'

export const usePdmFilters = (data: Seq<PdmData<PdmForm>> = seq()) => {
  const {m} = useI18n()

  const shape = useMemo(() =>
      DataFilter.makeShape<PdmData<PdmForm>>({
        oblast: {
          icon: 'location_on',
          label: m.oblast,
          getValue: _ => _.oblast,
          getOptions: () =>
            DataFilter.buildOptions(
              data.flatMap(_ => _.oblast!).distinct(_ => _).sort()
            ),
        },
        office: {
          icon: 'share',
          label: m.office,
          getValue: _ => _.office,
          getOptions: () =>
            DataFilter.buildOptions(
              data.flatMap(_ => _.office!).distinct(_ => _).sort()
            ),
        },
        project: {
          icon: 'business',
          label: m.project,
          getValue: _ => _.project,
          getOptions: () =>
            DataFilter.buildOptions(
              data.flatMap(_ => _.project!).distinct(_ => _).sort()
            ),
        },
      }),
    [data, m]
  )

  return {shape}
}

//   const [filters, setFilters] = useState<DataFilter.InferShape<typeof shape>>({})
//
//   return {
//     shape,
//     filters,
//     setFilters,
//   }
// }
