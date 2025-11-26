import {SchemaInspector} from './SchemaInspector.js'
import {Ip} from '@infoportal/api-sdk'

describe('SchemaHelper', () => {
  const schema = {
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

  describe('lookup', () => {
    it('builds questionIndex and choicesIndex correctly', () => {
      const helper = new SchemaInspector(schema)

      expect(helper.lookup.questionIndex['q1']?.name).toBe('q1')
      expect(helper.lookup.questionIndex['country']?.name).toBe('country')

      expect(helper.lookup.choicesIndex['countries']).toHaveLength(2)
    })
  })

  describe('sanitize', () => {
    it('schemaSanitized removes notes without calculation and calculate without label', () => {
      const helper = new SchemaInspector(schema)
      const sanitized = helper.schemaSanitized.survey.map(q => q.name)

      expect(sanitized).toContain('q1')
      expect(sanitized).toContain('country')
      expect(sanitized).not.toContain('note1')
      expect(sanitized).not.toContain('calc1')
    })

    it('schemaFlatAndSanitized uses depth0 grouping and sanitize logic', () => {
      const helper = new SchemaInspector(schema)
      const flat = helper.schemaFlatAndSanitized.map(q => q.name)

      expect(flat).toContain('q1')
      expect(flat).toContain('country')
      expect(flat).not.toContain('note1')
      expect(flat).not.toContain('calc1')
    })
  })

  describe('translation', () => {
    it('translates questions and choices for langIndex 0', () => {
      const helper = new SchemaInspector(schema, 0)

      expect(helper.translate.question('q1')).toBe('Hello')
      expect(helper.translate.choice('country', 'fr')).toBe('France')
    })

    it('translates with another langIndex using withLang()', () => {
      const helper = new SchemaInspector(schema, 0)
      const fr = helper.withLang(1)

      expect(fr.translate.question('q1')).toBe('Bonjour')
      expect(fr.translate.choice('country', 'es')).toBe('España')
    })

    it('withLang() does NOT mutate original instance', () => {
      const helper = new SchemaInspector(schema, 0)
      const fr = helper.withLang(1)

      expect(helper.translate.question('q1')).toBe('Hello') // original unchanged
      expect(fr.translate.question('q1')).toBe('Bonjour')
    })
  })

  describe('getOptionsByQuestionName', () => {
    it('returns choices for select_one question', () => {
      const helper = new SchemaInspector(schema)
      const options = helper.lookup.getOptionsByQuestionName('country')?.get()
      expect(options?.map(o => o.name)).toEqual(['fr', 'es'])
    })

    it('returns undefined for non-select questions', () => {
      const helper = new SchemaInspector(schema)
      expect(helper.lookup.getOptionsByQuestionName('q1')).toBeUndefined()
    })
  })

  describe('withMeta', () => {
    it('prepends meta questions and choices', () => {
      const labels = {
        start: 'start',
        end: 'end',
        submissionTime: 'submissionTime',
        version: 'version',
        attachments: 'attachments',
        geolocation: 'geolocation',
        isoCode: 'isoCode',
        id: 'id',
        uuid: 'uuid',
        validationStatus: 'validationStatus',
        validatedBy: 'validatedBy',
        submittedBy: 'submittedBy',
        lastValidatedTimestamp: 'lastValidatedTimestamp',
        updatedAt: 'updatedAt',
      }
      const choices = {validationStatus: {} as any}

      const helper = new SchemaInspector(schema)
      const withMeta = helper.withMeta(labels, choices)

      // meta are prepended
      expect(withMeta.schema.survey.length).toBeGreaterThan(schema.survey.length)
      expect(withMeta.includeMeta).toBe(true)
    })
  })
})
