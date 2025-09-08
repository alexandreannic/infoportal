import {tsRouter} from '@/Router'
// noinspection ES6UnusedImports
import {} from '@mui/material/themeCssVarsAugmentation'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}

declare module 'constrained-editor-plugin' {
  import type * as monaco from 'monaco-editor'

  export interface ConstrainedEditorRange {
    range: monaco.Range
    readOnly?: boolean
    allowMultiline?: boolean
  }

  export function constrainEditor(editor: monaco.editor.ICodeEditor, constraints: ConstrainedEditorRange[]): void
}

// declare module '@mui/material/styles' {
//   interface Theme {
//     vars: NonNullable<Theme['vars']>
//   }
// }
