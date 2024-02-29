import {add, Person} from '@infoportal-common'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Sheet} from '@/shared/Sheet/Sheet'
import React, {useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {Enum} from '@alexandreannic/ts-utils'


export const AgeGroupTable = ({
  tableId,
  persons,
}: {
  tableId: string
  persons?: Person.Person[]
}) => {
  const [tableAgeGroup, setTableAgeGroup] = usePersistentState<typeof Person.ageGroups[0]>('ECHO', {storageKey: 'mpca-dashboard-ageGroup'})
  const {m, formatLargeNumber} = useI18n()
  const data = useMemo(() => {
    if (!persons) return
    const gb = Person.groupByGenderAndGroup(Person.getAgeGroup(tableAgeGroup))(persons)
    return Enum.entries(gb).map(([k, v]) => ({ageGroup: k, ...v}))
  }, [persons, tableAgeGroup])
  return (
    <Sheet
      id={tableId}
      className="ip-border"
      hidePagination
      header={
        <ScRadioGroup value={tableAgeGroup} onChange={setTableAgeGroup} dense inline>
          {Person.ageGroups.map(_ =>
            <ScRadioGroupItem key={_} value={_} title={m._ageGroup[_] ?? _} hideRadio/>
          )}
        </ScRadioGroup>
      }
      data={data}
      columns={[
        {width: 0, id: 'Group', head: m.ageGroup, type: 'select_one', render: _ => _.ageGroup},
        {width: 0, id: 'Male', head: m.male, type: 'number', renderValue: _ => _.Male, render: _ => formatLargeNumber(_.Male)},
        {width: 0, id: 'Female', head: m.female, type: 'number', renderValue: _ => _.Female, render: _ => formatLargeNumber(_.Female)},
        {width: 0, id: 'Other', head: m.other, type: 'number', renderValue: _ => _.Other ?? 0, render: _ => formatLargeNumber(_.Other ?? 0)},
        {width: 0, id: 'Total', head: m.total, type: 'number', renderValue: _ => add(_.Male, _.Female, _.Other), render: _ => formatLargeNumber(add(_.Male, _.Female, _.Other))},
      ]}
    />
  )
}