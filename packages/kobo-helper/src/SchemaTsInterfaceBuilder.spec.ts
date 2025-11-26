import {SchemaTsInterfaceBuilder} from './SchemaTsInterfaceBuilder.js'
import {Ip} from '@infoportal/api-sdk'

describe.only('KoboBuildInterface', () => {
  it('Build', () => {
    const res = new SchemaTsInterfaceBuilder('Test', getSchema()).build()
    expect(res.startsWith('export namespace')).toBeTruthy()
  })
})

function getSchema(): Ip.Form.Schema {
  return {
    survey: [
      {
        type: 'text',
        name: 'q1',
        label: ['Hello', 'Bonjour'],
      },
      {
        type: 'select_one',
        name: 'country',
        label: ['Country', 'Pays'],
        select_from_list_name: 'countries',
      },
      {
        type: 'note',
        name: 'note1',
        label: undefined,
        calculation: undefined, // should be filtered out
      },
      {
        type: 'calculate',
        name: 'calc1',
        label: undefined, // should also be filtered out
      },
    ],
    choices: [
      {
        list_name: 'countries',
        name: 'fr',
        label: ['France', 'France_FR'],
      },
      {
        list_name: 'countries',
        name: 'es',
        label: ['Spain', 'España'],
      },
    ],
  } as Ip.Form.Schema
}
