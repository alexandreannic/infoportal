import {Box, BoxProps, Icon, Tab, Tabs, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Obj} from '@axanc/ts-utils'
import Editor, {useMonaco} from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'
// @ts-ignore
import {constrainedEditor} from 'constrained-editor-plugin'
import {Core} from '@/shared'

const monacoBg = '#1e1e1e'

type Props = BoxProps & {
  actionId: string
  saving?: boolean
  onSave: (_: {body: string; bodyErrors: number; bodyWarnings: number}) => void
  body?: string
  inputType: string
  outputType: string
  isReadOnly?: boolean
}

export function FormActionEditor(props: Props) {
  const monaco = useMonaco()
  if (monaco) {
    return <FormActionEditorWithMonaco monaco={monaco} {...props} />
  }
  return null
}

function FormActionEditorWithMonaco({
  body = getDefaultBody(),
  saving,
  onSave,
  inputType,
  actionId,
  monaco,
  isReadOnly,
  outputType,
  sx,
  ...props
}: Props & {
  monaco: NonNullable<ReturnType<typeof useMonaco>>
}) {
  const t = useTheme()
  const {m} = useI18n()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const files = useMemo(() => {
    return {
      '/action.ts': {
        value: body,
        isReadonly: false,
      },
      '/input.ts': {
        isReadonly: true,
        value: inputType,
      },
      '/output.ts': {
        isReadonly: true,
        value: outputType,
      },
      '/meta.ts': {
        isReadonly: true,
        value: getMetaInterface(),
      },
    } as const
  }, [body, inputType, outputType])

  const [activePath, setActivePath] = useState<keyof typeof files>('/action.ts')
  const [bodyChanges, setBodyChanges] = useState<string>(body)

  const handleSave = () => {
    if (isReadOnly) return
    const model = monaco.Uri.file('/action.ts')
    if (!model) throw new Error('Failed to load model.')
    const markers = monaco.editor?.getModelMarkers({resource: model})
    const errors = markers.filter(_ => _.severity >= monaco.MarkerSeverity.Error).length
    const warnings = markers.filter(
      _ => _.severity >= monaco.MarkerSeverity.Warning && _.severity < monaco.MarkerSeverity.Error,
    ).length
    onSave({body: bodyChanges, bodyWarnings: warnings, bodyErrors: errors})
  }

  useCaptureCtrlS(handleSave)
  useEffect(() => setBodyChanges(body), [body])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const uri = monaco.Uri.file(activePath)
    const model = monaco.editor.getModel(uri)
    if (!model) return

    editor.updateOptions({readOnly: false})
    editor.setModel(model)
    editor
      .getAction('editor.action.formatDocument')
      ?.run()
      .then(() => {
        editor.updateOptions({readOnly: isReadOnly ?? files[activePath].isReadonly})
      })
  }, [activePath])

  let restrictions: any[] = []

  return (
    <Box
      sx={{
        height: '100%',
        maxHeight: '85vh',
        minHeight: 0,
        borderRadius: t.vars.shape.borderRadius,
        overflow: 'hidden',
        background: monacoBg,
        ...sx,
      }}
      {...props}
    >
      <Tabs value={activePath} onChange={(e, _) => setActivePath(_)} sx={{background: 'none', mb: 0.5}}>
        {Obj.keys(files).map(_ => (
          <Tab
            sx={{color: 'white'}}
            label={
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {(isReadOnly || files[_].isReadonly) && (
                  <Icon fontSize="small" sx={{mr: 1}}>
                    lock
                  </Icon>
                )}
                {_.replace(/^\//, '')}
              </Box>
            }
            value={_}
            key={_}
          />
        ))}
        {!isReadOnly && (
          <Core.Btn
            loading={saving}
            onClick={handleSave}
            disabled={bodyChanges === body}
            variant="contained"
            size="small"
            sx={{alignSelf: 'center', marginLeft: 'auto', mr: 1}}
          >
            {m.save}
          </Core.Btn>
        )}
      </Tabs>
      <Editor
        key={actionId}
        options={{
          minimap: {enabled: false},
        }}
        onChange={_ => {
          if (activePath === '/action.ts') {
            setBodyChanges(_!)
          }
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          Obj.entries(files).forEach(([path, {value, isReadonly}]) => {
            let model = monaco.editor.getModel(monaco.Uri.file(path))
            if (!model) monaco.editor.createModel(value, 'typescript', monaco.Uri.file(path))
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              value,
              `file://${path}`, // keep the .ts extension here
            )
          })
          editor.setModel(monaco.editor.getModel(monaco.Uri.file(activePath)))
          // Readonly 1st row of action.ts
          const model = editor.getModel()!
          const constrainedInstance = constrainedEditor(monaco)
          constrainedInstance.initializeIn(editor)
          restrictions.push({
            range: [6, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())],
          })
          constrainedInstance.addRestrictionsTo(model, restrictions)
        }}
        beforeMount={monacoInstance => {
          monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            strict: true,
            noEmit: true,
            allowNonTsExtensions: true,
          })
        }}
        theme="vs-dark"
        defaultLanguage="typescript"
      />
    </Box>
  )
}

function getMetaInterface() {
  return [
    `// Meta Data`,
    `export type Submission<T extends Record<string, any>> = {`,
    `  id: string`,
    `  submissionTime: Date`,
    `  submittedBy: string`,
    `  answers: T`,
    `  start?: Date`,
    `  end?: Date`,
    `  version: string`,
    `  formId: string`,
    `  validationStatus: 'Approved' | 'Pending' | 'Rejected' | 'Flagged' | 'UnderReview'`,
    `  attachments: {`,
    `    download_url: string`,
    `    filename: string`,
    `    download_small_url: string`,
    `    question_xpath: string`,
    `    id: number`,
    `  }[]`,
    `}`,
  ].join('\n')
}

function getDefaultBody() {
  return [
    `import {Input} from 'input'`,
    `import {Output} from 'output'`,
    `import {Submission} from 'meta'`,
    ``,
    `async function transform(submission: Submission<Input.Type>): Promise<Output.Type | Output.Type[]> {`,
    `  // write your transformation here`,
    `  return submission`,
    `}`,
  ].join('\n')
}

function useCaptureCtrlS(action: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        action()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
