import {SubmissionXmlToJson} from './SubmissionXmlToJson.js'
import {Api} from '@infoportal/api-sdk'

const q = (type: Api.Form.QuestionType) => ({type})

describe('xmlToJsonWithStructure', () => {
  it('parses simple fields', () => {
    const xml = `<data><a>1</a><b>2</b></data>`

    const json = new SubmissionXmlToJson({
      a: q('text'),
      b: q('integer'),
    }).convert(xml)

    expect(json).toEqual({
      a: 1,
      b: 2,
    })
  })

  it('flattens begin_group', () => {
    const xml = `
      <data>
        <group1>
          <a>10</a>
          <b>20</b>
        </group1>
      </data>
    `

    const json = new SubmissionXmlToJson({
      group1: q('begin_group'),
      a: q('text'),
      b: q('text'),
    }).convert(xml)

    expect(json).toEqual({
      a: 10,
      b: 20,
    })
  })

  it('handles begin_repeat → array', () => {
    const xml = `
      <data>
        <rep>
          <foo>1</foo>
        </rep>
        <rep>
          <foo>2</foo>
        </rep>
      </data>
    `

    const json = new SubmissionXmlToJson({
      rep: q('begin_repeat'),
      foo: q('text'),
    }).convert(xml)

    expect(json).toEqual({
      rep: [{foo: 1}, {foo: 2}],
    })
  })

  it('handles nested groups inside repeats', () => {
    const xml = `
      <data>
        <rep>
          <group1>
            <x>abc</x>
          </group1>
        </rep>
      </data>
    `

    const json = new SubmissionXmlToJson({
      rep: q('begin_repeat'),
      group1: q('begin_group'),
      x: q('text'),
    }).convert(xml)

    expect(json).toEqual({
      rep: [{x: 'abc'}],
    })
  })

  it('handles nested repeats inside groups', () => {
    const xml = `
      <data>
        <group1>
          <rep>
            <y>1</y>
          </rep>
          <rep>
            <y>2</y>
          </rep>
        </group1>
      </data>
    `

    const json = new SubmissionXmlToJson({
      group1: q('begin_group'),
      rep: q('begin_repeat'),
      y: q('text'),
    }).convert(xml)

    expect(json).toEqual({
      rep: [{y: 1}, {y: 2}],
    })
  })

  it('full realistic ODK mixed structure', () => {
    const xml = `
      <data id="form123">
        <name>Alex</name>

        <info>
          <age>34</age>
          <city>Bogota</city>
        </info>

        <households>
          <member>
            <m_name>A</m_name>
            <m_age>10</m_age>
          </member>
          <member>
            <m_name>B</m_name>
            <m_age>12</m_age>
          </member>
        </households>

        <meta>
          <instanceID>uuid:123</instanceID>
        </meta>
      </data>
    `

    const json = new SubmissionXmlToJson({
      name: q('text'),
      info: q('begin_group'),
      age: q('integer'),
      city: q('text'),
      households: q('begin_group'),
      member: q('begin_repeat'),
      m_name: q('text'),
      m_age: q('integer'),
      meta: q('begin_group'),
      instanceID: q('text'),
    }).convert(xml)

    expect(json).toEqual({
      name: 'Alex',
      age: 34,
      city: 'Bogota',
      member: [
        {m_name: 'A', m_age: 10},
        {m_name: 'B', m_age: 12},
      ],
      instanceID: 'uuid:123',
    })
  })
})
