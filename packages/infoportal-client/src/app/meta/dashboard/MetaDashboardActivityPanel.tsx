import {fnSwitch, Obj} from '@alexandreannic/ts-utils'
import {ChartBar} from '@/shared/charts/ChartBar'
import {Lazy} from '@/shared/Lazy'
import React, {useState} from 'react'
import {useMetaContext} from '@/app/meta/MetaContext'
import {useI18n} from '@/core/i18n'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {PanelWBody} from '@/shared/Panel/PanelWBody'

export const MetaDashboardActivityPanel = () => {
  const [type, setType] = useState<'sector' | 'activity' | 'nfis'>('sector')
  const {m, formatLargeNumber} = useI18n()
  const {data: ctx} = useMetaContext()
  return (
    <PanelWBody>
      <ScRadioGroup value={type} onChange={setType} inline dense sx={{mb: 2}}>
        <ScRadioGroupItem hideRadio value="sector" title={m.program}/>
        <ScRadioGroupItem hideRadio value="activity" title={m.activity}/>
        <ScRadioGroupItem hideRadio value="nfis" title={m.nfis}/>
      </ScRadioGroup>

      {fnSwitch(type, {
        sector: (
          <ChartBarSingleBy data={ctx.filteredData} by={_ => _.sector}/>
        ),
        activity: (
          <ChartBarSingleBy data={ctx.filteredData} by={_ => _.activity}/>
        ),
        nfis: (
          <Lazy deps={[ctx.filteredData]} fn={() => {
            const d = ctx.filteredData.map(_ => _.tags).compact()
            // const total = d.sum(_ => {
            //   return add(
            //     _.HKF,
            //     _.NFKF_KS,
            //     _.FoldingBed,
            //     _.FKS,
            //     _.CollectiveCenterKits,
            //     _.BK,
            //     _.WKB,
            //     _.HKMV,
            //     _.ESK,
            //   )
            // })
            return {
              // total,
              data: new Obj({
                [m.nfi_.HKF]: {desc: 'HKF', value: d.sum(_ => _.HKF ?? 0)},
                [m.nfi_.NFKF_KS]: {desc: 'NFKF_KS', value: d.sum(_ => _.NFKF_KS ?? 0)},
                [m.nfi_.FoldingBed]: {desc: 'FoldingBed', value: d.sum(_ => _.FoldingBed ?? 0)},
                [m.nfi_.FKS]: {desc: 'FKS', value: d.sum(_ => _.FKS ?? 0)},
                [m.nfi_.CollectiveCenterKits]: {desc: 'CollectiveCenterKits', value: d.sum(_ => _.CollectiveCenterKits ?? 0)},
                [m.nfi_.BK]: {desc: 'BK', value: d.sum(_ => _.BK ?? 0)},
                [m.nfi_.WKB]: {desc: 'WKB', value: d.sum(_ => _.WKB ?? 0)},
                [m.nfi_.HKMV]: {desc: 'HKMV', value: d.sum(_ => _.HKMV ?? 0)},
                [m.nfi_.ESK]: {desc: 'ESK', value: d.sum(_ => _.ESK ?? 0)},
              }).sort(([, a], [, b]) => b.value - a.value).get()
            }
          }}>
            {_ => (
              <ChartBar data={_.data}/>
            )}
          </Lazy>
        )
      })}
    </PanelWBody>
  )
}

