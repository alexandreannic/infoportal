import {XMLParser} from 'fast-xml-parser'
import {SubmissionJsonToXml} from './SubmissionJsonToXml'
import {Api} from '@infoportal/api-sdk'

describe('SubmissionJsonToXml (xpath includes qname)', () => {
  const parseXml = (xml: string) => {
    const parser = new XMLParser({ignoreAttributes: false})
    return parser.parse(xml)
  }

  it('reconstructs nested groups using full xpath', () => {
    const qIndex = {
      ben_det_income: {$xpath: 'ben_det/ben_det_income', type: 'text'},
      ben_det_oblast: {$xpath: 'ben_det/ben_det_oblast', type: 'text'},
      calc_dis_level: {$xpath: 'calc_dis_level', type: 'calculate'},
    }

    const json = {
      id: 'id1',
      answers: {
        ben_det_income: '4500',
        ben_det_oblast: 'sumska',
        calc_dis_level: '1',
      },
    } as unknown as Api.Submission

    const converter = new SubmissionJsonToXml(qIndex)
    const xml = converter.convert(json)
    const parsed = parseXml(xml)

    expect(parsed.data.ben_det).toEqual({
      ben_det_income: 4500,
      ben_det_oblast: 'sumska',
    })

    expect(parsed.data.calc_dis_level).toBe('1')
  })

  it('handles repeat groups using full xpath', () => {
    const qIndex = {
      hh_char_hh_det: {$xpath: 'hh_char_hh_det', type: 'begin_repeat'},
      hh_char_hh_det_age: {
        $xpath: 'hh_char_hh_det/hh_char_hh_det_age',
        type: 'integer',
      },
      hh_char_tax_id_num: {
        $xpath: 'hh_char_hh_det/hh_char_tax_id_num',
        type: 'text',
      },
    }

    const json = {
      id: 'id1',
      answers: {
        hh_char_hh_det: [
          {hh_char_hh_det_age: '68', hh_char_tax_id_num: '2073009806'},
          {hh_char_hh_det_age: '28', hh_char_tax_id_num: '1073009806'},
        ],
      },
    } as unknown as Api.Submission

    const converter = new SubmissionJsonToXml(qIndex)
    const xml = converter.convert(json)
    const parsed = parseXml(xml)

    expect(parsed.data.hh_char_hh_det).toEqual([
      {
        hh_char_hh_det_age: 68,
        hh_char_tax_id_num: '2073009806',
      },
      {
        hh_char_hh_det_age: 28,
        hh_char_tax_id_num: 1073009806,
      },
    ])
  })

  it.only('mixed flat single fields and repeat groups', () => {
    const qIndex = {
      ben_det_income: {$xpath: 'ben_det/ben_det_income', type: 'text'},
      ben_det_oblast: {$xpath: 'ben_det/ben_det_oblast', type: 'text'},

      hh_char_hh_det: {$xpath: 'hh_char_hh_det', type: 'begin_repeat'},
      hh_char_hh_det_age: {
        $xpath: 'hh_char_hh_det/hh_char_hh_det_age',
        type: 'integer',
      },
      hh_char_tax_id_num: {
        $xpath: 'hh_char_hh_det/hh_char_tax_id_num',
        type: 'text',
      },
    }

    const json = {
      id: 'id1',
      answers: {
        ben_det_income: '4500',
        ben_det_oblast: 'sumska',
        hh_char_hh_det: [
          {hh_char_hh_det_age: '68', hh_char_tax_id_num: '2073009806'},
          {hh_char_hh_det_age: '2', hh_char_tax_id_num: '2073009806'},
        ],
      },
    } as unknown as Api.Submission

    const converter = new SubmissionJsonToXml(qIndex)
    const xml = converter.convert(json)
    const parsed = parseXml(xml)

    expect(parsed.data.ben_det).toEqual({
      ben_det_income: 4500,
      ben_det_oblast: 'sumska',
    })

    expect(parsed.data.hh_char_hh_det.length).toBe(2)
    expect(parsed.data.hh_char_hh_det[0]).toEqual({
      hh_char_hh_det_age: 68,
      hh_char_tax_id_num: 2073009806,
    })
  })

  it('root-level fields when xpath has no slash', () => {
    const qIndex = {
      root_field: {$xpath: 'root_field', type: 'text'},
    }

    const json = {
      id: 'id1',
      answers: {
        root_field: 'hello',
      },
    } as unknown as Api.Submission

    const converter = new SubmissionJsonToXml(qIndex)

    const xml = converter.convert(json)
    const parsed = parseXml(xml)

    expect(parsed.data.root_field).toBe('hello')
  })

  it('empty JSON gives empty <data/>', () => {
    const converter = new SubmissionJsonToXml({})
    const xml = converter.convert({id: 'id1', answers: {}} as unknown as Api.Submission)
    const parsed = parseXml(xml)

    expect(parsed).toHaveProperty('data')
  })
})
