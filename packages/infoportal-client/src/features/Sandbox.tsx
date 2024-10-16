import React, {useEffect} from 'react'
import {Seq, seq} from '@alexandreannic/ts-utils'
import {useMetaContext} from '@/app/meta/MetaContext'
import {useShelterData} from '@/features/Shelter/useShelterData'
import {DrcProgram, Person} from 'infoportal-common'
import {expect} from 'chai'

type Row = {
  id: string;
  persons: Person.Person[];
};

const extract = (p: Person.Person) => {
  return {age: p.age, gender: p.gender}
}

export const Sandbox = () => {
  const metaData = useMetaContext()
  const testData = useShelterData()

  useEffect(() => {
    metaData.fetcher.fetch({}, {activities: [DrcProgram.ShelterRepair]})
    testData.fetchAll()
  }, [])

  const compareDataArrays = (arr1: Seq<Row>, arr2: Seq<Row>): void => {
    const differingElements: {id: string; item1: Row['persons']; item2: Row['persons']}[] = []

    const indexArr2 = arr2.groupByFirst(item => item.id)
    console.log('>>>', arr1.length, arr2.length, indexArr2)

    arr1.forEach((item1) => {
      // console.log(item1.id)
      const item2 = indexArr2[item1.id]
      // console.log('>>', item1.persons.map(extract), item2?.persons.map(extract))
      if (item2) {
        try {
          expect(item1.persons.map(extract)).deep.equal(item2.persons.map(extract))
        } catch (e) {
          differingElements.push({id: item1.id, item1: item1.persons.map(extract), item2: item2.persons.map(extract)})
        }
      }
    })

    if (differingElements.length > 0) {
      console.log('Diff', differingElements.length)
      differingElements.forEach((diff, i) => {
        console.log('Diff', i + '/' + arr1.length, diff.id, diff.item1, diff.item2)
      })
    } else {
      console.log('No differences found between the data arrays based on persons.')
    }
  }

  useEffect(() => {
    if (!(metaData.data?.data) || !(testData.mappedData?.length)) {
      return
    }
    const meta: Seq<Row> = seq(metaData.data.data.filter(_ => _.activity === DrcProgram.ShelterRepair) || []).map(t => ({
      id: t.koboId,
      persons: t.persons ?? [],
    }))

    const shelter: Seq<Row> = seq(testData.mappedData || [])
      .filter(t => t.nta?.id)
      .map(t => {
        const result: Row = {
          id: t.nta!.id,
          persons: t.persons ?? [],
        }
        return result
      }).compact()

    compareDataArrays(shelter, meta)
  }, [metaData.data.data, testData.mappedData])

  return <div/>
}
