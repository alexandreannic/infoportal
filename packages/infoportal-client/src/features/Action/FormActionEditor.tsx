import {Box, Tab, Tabs, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n/index.js'
import {useEffect, useMemo, useRef, useState} from 'react'
import * as monaco from 'monaco-editor'
import {Obj} from '@axanc/ts-utils'
import Editor from '@monaco-editor/react'
// @ts-ignore
import {constrainedEditor} from 'constrained-editor-plugin'

const monacoBg = '#1e1e1e'

const defaultActionBody = [
  `import {Input} from 'input'`,
  ``,
  `async function transform(submission: Input.Type): Promise<SmartDbRow | SmartDbRow[]> {`,
  `  // write your transformation here`,
  `  return submission`,
  `}`,
].join('\n')

export function FormActionEditor({
  body = defaultActionBody,
  onBodyChange,
  inputType,
  outputType,
}: {
  onBodyChange: (_: string) => void
  body?: string
  inputType: string
  outputType: string
}) {
  const t = useTheme()
  const {m} = useI18n()

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
        value: inputType,
      },
    } as const
  }, [body, inputType, outputType])

  const [activePath, setActivePath] = useState<keyof typeof files>('/action.ts')

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)

  let restrictions: any[] = []

  useEffect(() => {
    const editor = editorRef.current
    const mon = monacoRef.current
    if (!editor || !mon) return

    const uri = mon.Uri.file(activePath)
    const model = mon.editor.getModel(uri)
    if (!model) return

    editor.setModel(model)
    editor.updateOptions({readOnly: files[activePath].isReadonly})
  }, [activePath])

  return (
    <Box sx={{borderRadius: t.vars.shape.borderRadius, overflow: 'hidden', background: monacoBg}}>
      {/*<Core.Btn variant="outlined">{m.save}</Core.Btn>*/}
      <Tabs value={activePath} onChange={(e, _) => setActivePath(_)} sx={{background: 'none', mb: 0.5}}>
        {Obj.keys(files).map(_ => (
          <Tab sx={{color: 'white'}} label={_.replace(/^\//, '')} value={_} key={_} />
        ))}
      </Tabs>
      <Editor
        options={{
          minimap: {enabled: false},
        }}
        onChange={_ => {
          if (activePath === '/action.ts') onBodyChange(_!)
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco

          Obj.entries(files).forEach(([path, {value, isReadonly}]) => {
            let model = monaco.editor.getModel(monaco.Uri.file(path))
            if (!model) monaco.editor.createModel(value, 'typescript', monaco.Uri.file(path))
          })
          editor.setModel(monaco.editor.getModel(monaco.Uri.file(activePath)))

          // Readonly 1st row of action.ts
          const model = editor.getModel()!
          const constrainedInstance = constrainedEditor(monaco)
          constrainedInstance.initializeIn(editor)
          restrictions.push({
            range: [4, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())],
          })
          constrainedInstance.addRestrictionsTo(model, restrictions)
        }}
        beforeMount={(monacoInstance: typeof monaco) => {
          // monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(interfaceInput, 'file:///input.d.ts')
          monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            strict: true,
            noEmit: true,
            allowNonTsExtensions: true,
          })
        }}
        height="80vh"
        theme="vs-dark"
        defaultLanguage="typescript"
      />
    </Box>
  )
}
