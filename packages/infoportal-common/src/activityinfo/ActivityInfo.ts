export namespace ActivityInfo {
  export type Id = string

  export type Form = {
    resources: {
      id: Id
      parentId: Id
      label: string
      type: 'FORM'
      visibility: 'PRIVATE'
    }[]
  }

  export type FormTree = Record<Id, FormSchema>

  export type FormSchema = {
    id: Id
    permissions: {
      viewFilter?: string
    }
    schema: {
      elements: FormElement[]
    }
  }

  export type FormElement = {
    id: Id
    code: string
    label: string
    description: string
    relevanceCondition: string
    validationCondition: string
    required: boolean
    type: 'subform' | 'reference' | 'enumerated' | 'calculated' | 'quantity' | 'FREE_TEXT' | 'month' | string
    typeParameters: {
      formId?: Id
      cardinality?: 'single'
      range?: [{formId: Id}]
      values?: {id: string; label: string}[]
      // formula?: string
    }
  }

  export type Database = {
    databaseId: string
    label: string
    description: string
    ownerId: string
  }
}
