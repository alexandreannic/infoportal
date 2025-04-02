import {KoboFlattenRepeatedGroup} from './koboFlattenRepeatedGroup'

describe('koboFlattenRepeatedGroup', () => {
  it('should flatten the nested objects', () => {
    expect(
      KoboFlattenRepeatedGroup.run({data: getData(), path: ['children', 'grandchildren'], replicateParentData: false}),
    ).toEqual([
      {
        submissionTime: '2024-11-07T05:48:16.000Z',
        grandchildren_name: 'Charles',
        id: '618190661',
        _parent_index: 0,
        _index: 0,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-07T05:48:16.000Z',
        grandchildren_name: 'Alex',
        id: '618190661',
        _index: 1,
        _parent_index: 0,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-07T05:48:16.000Z',
        grandchildren_name: '??',
        id: '618190661',
        _index: 0,
        _parent_index: 2,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-04T08:53:54.000Z',
        grandchildren_name: 'grandchildren_name111',
        id: '617150518',
        _index: 0,
        _parent_index: 0,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-04T08:53:54.000Z',
        grandchildren_name: 'grandchildren_name112',
        id: '617150518',
        _index: 1,
        _parent_index: 0,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-04T08:53:54.000Z',
        grandchildren_name: 'children_name211',
        id: '617150518',
        _parent_index: 1,
        _index: 0,
        _parent_table_name: 'children',
      },
      {
        submissionTime: '2024-11-04T08:53:54.000Z',
        grandchildren_name: 'children_name212',
        id: '617150518',
        _index: 1,
        _parent_index: 1,
        _parent_table_name: 'children',
      },
    ])
  })
})

function getData(): any[] {
  return [
    {
      submissionTime: '2024-11-07T05:48:16.000Z',
      id: '618190661',
      cousin: [
        {
          cousin_name: 'Gaetan',
        },
      ],
      children: [
        {
          children_name: 'Jerome',
          grandchildren: [
            {
              grandchildren_name: 'Charles',
            },
            {
              grandchildren_name: 'Alex',
            },
          ],
        },
        {
          children_name: 'Fabrice',
        },
        {
          children_name: 'Etienne',
          grandchildren: [
            {
              grandchildren_name: '??',
            },
          ],
        },
      ],
      family_name: 'Annic',
      formId: 'apn6HTbCJgwzrrGAywJdp2',
    },
    {
      submissionTime: '2024-11-04T08:53:54.000Z',
      id: '617150518',
      cousin: [
        {
          cousin_name: 'cousin_name1',
        },
        {
          cousin_name: 'cousin_name2',
        },
      ],
      children: [
        {
          children_name: 'children_name11',
          grandchildren: [
            {
              grandchildren_name: 'grandchildren_name111',
            },
            {
              grandchildren_name: 'grandchildren_name112',
            },
          ],
          grandchildren2: [
            {
              grandchildren2_name: 'grandchildren_name121',
            },
            {
              grandchildren2_name: 'grandchildren2_name122',
            },
          ],
        },
        {
          children_name: 'children_name2',
          grandchildren: [
            {
              grandchildren_name: 'children_name211',
            },
            {
              grandchildren_name: 'children_name212',
            },
          ],
          grandchildren2: [
            {
              grandchildren2_name: 'children_name221',
            },
          ],
        },
      ],
      family_name: 'family_name',
      formId: 'apn6HTbCJgwzrrGAywJdp2',
    },
  ]
}
