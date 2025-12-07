import {SchemaToXlsForm} from './SchemaToXlsForm'
import {Api} from '@infoportal/api-sdk'

describe('SchemaToXlsForm.convert', () => {
  test('flattens translated fields into lang columns', () => {
    const input: Api.Form.Schema = {
      translations: ['en', 'fr'],
      translated: ['label', 'hint'],
      survey: [
        {
          name: 'q1',
          type: 'text',
          label: ['Hello', 'Bonjour'],
          hint: ['Type here', 'Écris ici'],
          // @ts-ignore
          other: 'x',
        },
      ],
      choices: [],
      settings: {},
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.survey).toEqual([
      {
        name: 'q1',
        type: 'text',
        'label:en': 'Hello',
        'label:fr': 'Bonjour',
        'hint:en': 'Type here',
        'hint:fr': 'Écris ici',
        other: 'x',
      },
    ])

    expect(out.choices).toEqual([])
    expect(out.settings).toEqual({})
  })
  test('map question with choices', () => {
    const input: Api.Form.Schema = {
      translations: ['en', 'fr'],
      translated: ['label', 'hint'],
      survey: [
        {
          name: 'q1',
          type: 'select_one',
          select_from_list_name: 'yn',
          label: ['Hello', 'Bonjour'],
          hint: ['Type here', 'Écris ici'],
          // @ts-ignore
          other: 'x',
        },
        {
          name: 'q2',
          type: 'select_multiple',
          select_from_list_name: 'yn',
          label: ['Hello', 'Bonjour'],
          hint: ['Type here', 'Écris ici'],
          // @ts-ignore
          other: 'x',
        },
      ],
      choices: [
        {list_name: 'yn', label: ['yes', 'yes'], name: 'yes', $kuid: ''},
        {list_name: 'yn', label: ['no', 'no'], name: 'no', $kuid: ''},
      ],
      settings: {},
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.survey).toEqual([
      {
        name: 'q1',
        type: 'select_one yn',
        'label:en': 'Hello',
        'label:fr': 'Bonjour',
        'hint:en': 'Type here',
        'hint:fr': 'Écris ici',
        other: 'x',
      },
      {
        name: 'q2',
        type: 'select_multiple yn',
        'label:en': 'Hello',
        'label:fr': 'Bonjour',
        'hint:en': 'Type here',
        'hint:fr': 'Écris ici',
        other: 'x',
      },
    ])

    expect(out.choices).toEqual([
      {
        'label:en': 'yes',
        'label:fr': 'yes',
        list_name: 'yn',
        name: 'yes',
      },
      {
        'label:en': 'no',
        'label:fr': 'no',
        list_name: 'yn',
        name: 'no',
      },
    ])
    expect(out.settings).toEqual({})
  })

  test('omits missing translations safely', () => {
    const input: Api.Form.Schema = {
      translations: ['en', 'fr'],
      translated: ['label'],
      survey: [
        {
          name: 'q1',
          type: 'text',
          label: ['Hello'],
          $kuid: '',
          $xpath: '',
        },
      ],
      choices: [],
      settings: {},
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.survey).toEqual([
      {
        name: 'q1',
        type: 'text',
        'label:en': 'Hello',
        'label:fr': '', // missing → empty string
      },
    ])
  })

  test('passes through non-translated fields untouched', () => {
    const input: Api.Form.Schema = {
      translations: ['en', 'sw'],
      translated: ['label'],
      survey: [
        {
          name: 'age',
          type: 'integer',
          label: ['Age', 'Umri'],
          required: true,
          default: '18',
          $kuid: '',
          $xpath: '',
        },
      ],
      choices: [],
      settings: {},
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.survey[0].required).toBe(true)
    expect(out.survey[0].default).toBe('18')
  })

  test('handles choices table the same way as survey', () => {
    const input: Api.Form.Schema = {
      translations: ['en', 'es'],
      translated: ['label'],
      survey: [],
      choices: [
        {
          list_name: 'yesno',
          name: 'yes',
          label: ['Yes', 'Sí'],
          $kuid: '',
        },
        {
          list_name: 'yesno',
          name: 'no',
          label: ['No', 'No'],
          $kuid: '',
        },
      ],
      settings: {},
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.choices).toEqual([
      {
        list_name: 'yesno',
        name: 'yes',
        'label:en': 'Yes',
        'label:es': 'Sí',
      },
      {
        list_name: 'yesno',
        name: 'no',
        'label:en': 'No',
        'label:es': 'No',
      },
    ])
  })

  test('returns settings untouched', () => {
    const input: Api.Form.Schema = {
      translations: [],
      translated: [],
      survey: [],
      choices: [],
      settings: {
        form_title: 'My Form',
        version: '1.0.0',
      } as any,
    }

    const out = SchemaToXlsForm.convert(input).asJson()

    expect(out.settings).toEqual({
      form_title: 'My Form',
      version: '1.0.0',
    })
  })
})
