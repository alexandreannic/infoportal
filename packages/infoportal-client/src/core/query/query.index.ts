import {Kobo} from 'kobo-sdk'

export const queryKeys = {
  // sessionSpy: () => ['sessionSpy'],
  session: () => ['session'],
  access: () => ['access'],
  workspaces: () => ['workspaces'],
  formSchema: (formId?: Kobo.FormId) => (formId ? ['formSchema', formId] : ['formSchema']),
  workspaceUsers: (formId?: Kobo.FormId) => (formId ? ['workspaceUsers', formId] : ['workspaceUsers']),
  answers: (formId?: Kobo.FormId) => (formId ? ['answers', formId] : ['answers']),
}
